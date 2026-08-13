import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { execWithOutput } from '../../utils/execWithOutput.ts';

import { describeExecError } from './staticChecks.ts';

const FIXTURE_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../fixtures/consumer');

export async function setupConsumer(tgzPaths: Record<string, string>, workRoot: string): Promise<string> {
  const consumerDir = path.join(workRoot, 'consumer');
  fs.cpSync(FIXTURE_DIR, consumerDir, { recursive: true });

  const pkgJsonPath = path.join(consumerDir, 'package.json');
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
  Object.entries(tgzPaths).forEach(([name, tgzPath]) => {
    pkgJson.dependencies[name] = `file:${tgzPath}`;
  });
  fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2));

  await execWithOutput('npm', ['install', '--no-audit', '--no-fund', '--loglevel=error'], { cwd: consumerDir });
  return consumerDir;
}

export function runSmoke(consumerDir: string): string[] {
  const problems: string[] = [];
  const steps: Array<[string, string]> = [
    ['CJS require', 'node cjs-consumer.cjs'],
    ['ESM import', 'node esm-consumer.mjs'],
    ['types (bundler resolution)', 'npx tsc -p tsconfig.bundler.json'],
    ['types (node16 resolution)', 'npx tsc -p tsconfig.node16.json'],
  ];
  for (const [label, command] of steps) {
    try {
      execSync(command, { cwd: consumerDir, encoding: 'utf8', stdio: 'pipe' });
    } catch (error) {
      problems.push(`${label}: ${describeExecError(error)}`);
    }
  }
  return problems;
}
