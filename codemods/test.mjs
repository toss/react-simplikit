// Runs every jssg transform against its fixtures: `<codemod>/scripts/<name>.ts` is tested with
// `<codemod>/tests/<language>/<name>/<case>/{input,expected}.*` (plus `metrics.json` when it reports),
// once per grammar `workflow.yaml` runs it with.
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Pinned and run through npx rather than a devDependency: the CLI ships a ~140MB native binary per
// platform, which the committed yarn cache cannot hold (GitHub rejects files over 100MB).
const CODEMOD_CLI = 'codemod@1.18.6';

// `tsx` parses JSX and `typescript` parses `<T>value`; workflow.yaml runs every script with both.
const LANGUAGES = ['tsx', 'typescript'];

const root = path.dirname(fileURLToPath(import.meta.url));
let failed = false;

const fail = message => {
  console.error(message);
  failed = true;
};

for (const codemod of readdirSync(root, { withFileTypes: true })) {
  if (!codemod.isDirectory()) {
    continue;
  }

  const dir = path.join(root, codemod.name);
  const workflow = readFileSync(path.join(dir, 'workflow.yaml'), 'utf8');

  // `codemod workflow validate` passes a missing js_file, so check both directions here.
  for (const [, jsFile] of workflow.matchAll(/js_file:\s*(\S+)/g)) {
    if (!existsSync(path.join(dir, jsFile))) {
      fail(`${codemod.name}/workflow.yaml points at ${jsFile}, which does not exist`);
    }
  }

  for (const script of readdirSync(path.join(dir, 'scripts'))) {
    const name = path.basename(script, '.ts');

    for (const language of LANGUAGES) {
      if (!new RegExp(`js_file: scripts/${script}\\s+language: ${language}\\b`).test(workflow)) {
        fail(`${codemod.name}/workflow.yaml does not run scripts/${script} with language: ${language}`);
      }
    }

    if (!existsSync(path.join(dir, 'tests', 'tsx', name))) {
      fail(`${codemod.name}/scripts/${script} has no fixtures at ${codemod.name}/tests/tsx/${name}`);
    }

    for (const language of LANGUAGES) {
      // npx runs from the package root, so every path is absolute.
      const tests = path.join(dir, 'tests', language, name);

      if (!existsSync(tests)) {
        continue;
      }

      const args = ['--yes', CODEMOD_CLI, 'jssg', 'test', '-l', language, '--disable-analytics'];
      const result = spawnSync('npx', [...args, path.join(dir, 'scripts', script), tests], { stdio: 'inherit' });

      failed ||= result.status !== 0;
    }
  }
}

// The published entry point: a dry run over the fixtures has to find the workflow and report.
const cliArgs = ['v0-to-v1', '--dry-run', '--no-interactive', '--allow-dirty', '--disable-analytics'];
const cli = spawnSync(process.execPath, [path.join(root, 'cli.mjs'), ...cliArgs, '-t', path.join(root, 'v0-to-v1')], {
  encoding: 'utf8',
});

if (cli.status !== 0 || !cli.stdout.includes('manual-review')) {
  fail(`cli.mjs v0-to-v1 --dry-run failed:\n${cli.stdout}${cli.stderr}`);
}

process.exitCode = failed ? 1 : 0;
