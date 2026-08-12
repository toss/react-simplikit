import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { buildAll, packPackage } from './checks/pack.ts';
import { checkBanner, checkExportsExist, extractTarball, runAttw, runPublint } from './checks/staticChecks.ts';
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

async function main() {
  const workRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-pack-'));
  console.log(`work dir: ${workRoot}`);

  buildAll();

  for (const pkg of TARGET_PACKAGES) {
    const { tgzPath } = packPackage(pkg, workRoot);
    const extractedDir = extractTarball(tgzPath, path.join(workRoot, pkg.name.replace('/', '__')));

    report(pkg.name, 'use client banner', checkBanner(extractedDir));
    report(pkg.name, 'exports files exist in tarball', checkExportsExist(extractedDir));
    report(pkg.name, 'publint', runPublint(extractedDir));
    report(pkg.name, 'attw type resolution', runAttw(tgzPath));
  }

  if (failures.length > 0) {
    console.error(`\nverify-pack failed:\n\n${failures.join('\n\n')}`);
    process.exit(1);
  }
  console.log('\nverify-pack passed');
}

main();
