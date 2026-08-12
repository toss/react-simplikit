import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { getRootPath } from '../../utils/getRootPath.ts';

export function extractTarball(tgzPath: string, workDir: string): string {
  fs.mkdirSync(workDir, { recursive: true });
  execSync(`tar -xzf ${JSON.stringify(tgzPath)} -C ${JSON.stringify(workDir)}`);
  return path.join(workDir, 'package');
}

function walkFiles(dir: string): string[] {
  return fs
    .readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile())
    .map(entry => path.join(entry.parentPath, entry.name));
}

export function checkBanner(extractedDir: string): string[] {
  const jsFiles = walkFiles(extractedDir).filter(
    file => file.endsWith('.js') || file.endsWith('.cjs') || file.endsWith('.mjs')
  );

  if (jsFiles.length === 0) {
    return ['🚨 Scanned 0 .js/.cjs/.mjs files — the paths in this check no longer match the build output layout.'];
  }

  console.log(`Scanned ${jsFiles.length} .js/.cjs/.mjs files for the "use client" banner.`);
  return jsFiles.filter(file => !fs.readFileSync(file, 'utf8').startsWith('"use client";'));
}

function collectExportPaths(value: unknown, acc: string[]): string[] {
  if (typeof value === 'string' && value.startsWith('./')) {
    acc.push(value);
  } else if (typeof value === 'object' && value !== null) {
    Object.values(value).forEach(nested => collectExportPaths(nested, acc));
  }
  return acc;
}

export function checkExportsExist(extractedDir: string): string[] {
  const pkg = JSON.parse(fs.readFileSync(path.join(extractedDir, 'package.json'), 'utf8'));
  const declared = collectExportPaths(pkg.exports, []);
  ['main', 'module', 'types'].forEach(field => {
    if (typeof pkg[field] === 'string') {
      declared.push(pkg[field]);
    }
  });
  const uniqueDeclared = [...new Set(declared)];

  if (uniqueDeclared.length === 0) {
    return ['🚨 Scanned 0 declared export paths — the paths in this check no longer match the package.json layout.'];
  }

  console.log(`Scanned ${uniqueDeclared.length} declared export paths.`);
  return uniqueDeclared.filter(declaredPath => !fs.existsSync(path.join(extractedDir, declaredPath)));
}

// `??` would leave a blank entry when the process dies without writing to stdout
// (internal crash, signal kill) — stderr or the error's own message is the only
// diagnostic left in that case, so fall through to whichever is non-empty.
function describeExecError(error: unknown): string {
  const { stdout, stderr } = error as { stdout?: string; stderr?: string };
  if (stdout !== undefined && stdout !== '') return stdout;
  if (stderr !== undefined && stderr !== '') return stderr;
  return String(error);
}

// Running `yarn publint`/`yarn attw` with cwd inside the extracted tarball makes Yarn PnP
// try to resolve the extracted package.json as a workspace member and throw an internal
// resolution error instead of linting. Run from the repo root and pass the path as an argument.
export function runPublint(extractedDir: string): string[] {
  try {
    execSync(`yarn publint ${JSON.stringify(extractedDir)} --strict`, {
      cwd: getRootPath(),
      encoding: 'utf8',
      stdio: 'pipe',
    });
    return [];
  } catch (error) {
    return [describeExecError(error)];
  }
}

export function runAttw(tgzPath: string): string[] {
  try {
    execSync(`yarn attw ${JSON.stringify(tgzPath)}`, {
      cwd: getRootPath(),
      encoding: 'utf8',
      stdio: 'pipe',
    });
    return [];
  } catch (error) {
    return [describeExecError(error)];
  }
}
