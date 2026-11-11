#!/usr/bin/env node
// `npx @react-simplikit/codemod <codemod> [options]` runs `<codemod>/workflow.yaml` with the Codemod CLI on the
// current folder, passing the options through.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Run through npx rather than a dependency, for the same reason as in test.mjs. Keep the two pins in sync.
const CODEMOD_CLI = 'codemod@1.18.6';

const [name, ...options] = process.argv.slice(2);
const workflow = fileURLToPath(new URL(`${name}/workflow.yaml`, import.meta.url));

if (name === undefined || name.startsWith('-') || !existsSync(workflow)) {
  console.error('Usage: npx @react-simplikit/codemod v0-to-v1 [--dry-run] [-t <path>] [--no-interactive]');
  process.exit(1);
}

// shortcut: Windows needs a shell to run npx, so an option containing a space breaks there; quote options if it matters.
const isWindows = process.platform === 'win32';
const { status } = spawnSync(
  'npx',
  ['--yes', CODEMOD_CLI, 'workflow', 'run', '-w', isWindows ? `"${workflow}"` : workflow, ...options],
  { stdio: 'inherit', shell: isWindows }
);

process.exitCode = status ?? 1;
