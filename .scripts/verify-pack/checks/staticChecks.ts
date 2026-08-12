import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

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
  return walkFiles(extractedDir)
    .filter(file => file.endsWith('.js') || file.endsWith('.cjs') || file.endsWith('.mjs'))
    .filter(file => !fs.readFileSync(file, 'utf8').startsWith('"use client";'));
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
  return [...new Set(declared)].filter(declaredPath => !fs.existsSync(path.join(extractedDir, declaredPath)));
}
