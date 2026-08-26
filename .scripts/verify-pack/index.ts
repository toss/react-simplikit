import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { checkUseNoMemoDirectives } from './checks/directives.ts';
import { buildAll, packPackage } from './checks/pack.ts';
import { checkSizeLimit, measureImportCost } from './checks/size.ts';
import { runSmoke, setupConsumer } from './checks/smoke.ts';
import {
  checkBanner,
  checkExportsExist,
  describeExecError,
  extractTarball,
  runAttw,
  runPublint,
} from './checks/staticChecks.ts';
import { TARGET_PACKAGES } from './packages.ts';

const failures: string[] = [];

function report(pkgName: string, step: string, problems: string[]) {
  if (problems.length === 0) {
    console.log(`✅ [${pkgName}] ${step}`);
  } else {
    failures.push(`[${pkgName}] ${step}:\n${problems.map(problem => `  - ${problem}`).join('\n')}`);
    console.error(`❌ [${pkgName}] ${step}`);
  }
}

function exitIfFailed() {
  if (failures.length > 0) {
    console.error(`\nverify-pack failed:\n\n${failures.join('\n\n')}`);
    process.exit(1);
  }
}

async function main() {
  const workRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-pack-'));
  console.log(`work dir: ${workRoot}`);

  // A failed build leaves no valid dist to pack — report it and stop here rather
  // than packing stale output and reporting misleading downstream results.
  try {
    await buildAll();
  } catch (error) {
    report('build', 'workspace build', [describeExecError(error)]);
    exitIfFailed();
  }

  const tgzPaths: Record<string, string> = {};

  for (const pkg of TARGET_PACKAGES) {
    const { tgzPath } = packPackage(pkg, workRoot);
    tgzPaths[pkg.name] = tgzPath;
    const extractedDir = extractTarball(tgzPath, path.join(workRoot, pkg.name.replace('/', '__')));

    report(pkg.name, 'use client banner', checkBanner(extractedDir));
    report(pkg.name, 'use no memo directives', checkUseNoMemoDirectives(pkg, extractedDir));
    report(pkg.name, 'exports files exist in tarball', checkExportsExist(extractedDir));
    report(pkg.name, 'publint', runPublint(extractedDir));
    report(pkg.name, 'attw type resolution', runAttw(tgzPath));
  }

  // Isolate `npm install` failures from an uncaught crash: without this, a failed
  // install would skip `report()` entirely and exit with a raw stack trace instead
  // of a diagnosable failure entry.
  let consumerDir: string | undefined;
  try {
    consumerDir = await setupConsumer(tgzPaths, workRoot);
    report('consumer', 'smoke (require/import/types)', runSmoke(consumerDir));
  } catch (error) {
    report('consumer', 'smoke (require/import/types)', [describeExecError(error)]);
  }

  const skipSize = process.argv.includes('--skip-size');
  if (skipSize) {
    console.log('⏭️  size gate skipped (--skip-size)');
  } else if (consumerDir === undefined) {
    // Consumer setup already failed and was reported above — silently skipping the
    // size gate here (no report() call) would hide that it never ran either.
    report('consumer', 'tree-shaking size gate', [
      'consumer setup failed — size gate could not run without an installed consumer',
    ]);
  } else {
    for (const pkg of TARGET_PACKAGES) {
      for (const gate of pkg.sizeGates) {
        try {
          const bytes = await measureImportCost(gate.entry, consumerDir);
          console.log(`[${pkg.name}] ${gate.label} single-export import cost: ${bytes}B (limit ${gate.limitBytes}B)`);
          report(pkg.name, `tree-shaking size gate (${gate.label})`, checkSizeLimit(bytes, gate.limitBytes));
        } catch (error) {
          report(pkg.name, `tree-shaking size gate (${gate.label})`, [describeExecError(error)]);
        }
      }
    }
  }

  exitIfFailed();
  console.log('\nverify-pack passed');
}

main();
