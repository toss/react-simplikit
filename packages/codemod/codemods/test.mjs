// Runs every jssg transform against its fixtures: `<codemod>/scripts/<name>.ts` is tested with
// `<codemod>/tests/<name>/<case>/{input,expected}.tsx` (plus `metrics.json` when it reports).
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Pinned and run through npx rather than a devDependency: the CLI ships a ~140MB native binary per
// platform, which the committed yarn cache cannot hold (GitHub rejects files over 100MB).
const CODEMOD_CLI = 'codemod@1.18.6';

const root = path.dirname(fileURLToPath(import.meta.url));
let failed = false;

for (const codemod of readdirSync(root, { withFileTypes: true })) {
  if (!codemod.isDirectory()) {
    continue;
  }

  for (const script of readdirSync(path.join(root, codemod.name, 'scripts'))) {
    const name = path.basename(script, '.ts');
    // npx runs from the package root, so every path is absolute.
    const tests = path.join(root, codemod.name, 'tests', name);

    if (!existsSync(tests)) {
      console.error(`${codemod.name}/scripts/${script} has no fixtures at ${codemod.name}/tests/${name}`);
      failed = true;
      continue;
    }

    const args = ['--yes', CODEMOD_CLI, 'jssg', 'test', '-l', 'tsx', '--disable-analytics'];
    const result = spawnSync('npx', [...args, path.join(root, codemod.name, 'scripts', script), tests], {
      stdio: 'inherit',
    });

    failed ||= result.status !== 0;
  }
}

process.exitCode = failed ? 1 : 0;
