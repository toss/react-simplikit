import { Command, CommanderError } from 'commander';
import { readFileSync } from 'node:fs';
import process from 'node:process';

import { collectFiles } from './runner/collectFiles.ts';
import { runTransform } from './runner/runTransform.ts';
import { MOBILE_PACKAGE_NAME, ROOT_PACKAGE_NAME, TRANSFORM_NAME } from './constants.ts';
import { describeError, UsageError } from './errors.ts';
import { formatHuman } from './formatHuman.ts';

const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {
  version: string;
};

type TransformOptions = {
  dryRun: boolean;
  json: boolean;
  debug: boolean;
  packageJson: boolean;
  ignore: string[];
};

let debugEnabled = false;

function collectIgnore(value: string, previous: string[]): string[] {
  return [...previous, value];
}

async function runCommand(paths: string[], options: TransformOptions): Promise<void> {
  debugEnabled = options.debug;

  const cwd = process.cwd();

  const files = await collectFiles({
    paths,
    ignore: options.ignore,
    includePackageJson: options.packageJson,
    cwd,
  });

  const result = await runTransform({ files, cwd, dryRun: options.dryRun, debug: options.debug });
  const report = options.json
    ? JSON.stringify({ transform: TRANSFORM_NAME, dryRun: options.dryRun, ...result }, null, 2)
    : formatHuman(result, options.dryRun);

  process.stdout.write(`${report}\n`);

  if (result.failed.length > 0) {
    process.stderr.write(`${result.failed.length} file(s) could not be processed.\n`);
    process.exitCode = 1;
  }
}

function buildProgram(): Command {
  const program = new Command();

  program
    .name('react-simplikit-codemod')
    .description('Codemods for migrating react-simplikit entry points')
    .version(version)
    .showHelpAfterError()
    .exitOverride();

  program
    .command(TRANSFORM_NAME)
    .description(`Rewrite ${MOBILE_PACKAGE_NAME} imports to ${ROOT_PACKAGE_NAME}`)
    .argument('[paths...]', 'files or directories to transform', ['.'])
    .option('--dry-run', 'report what would change without writing files', false)
    .option('--json', 'print a machine-readable report to stdout', false)
    .option('--debug', 'print the stack trace when the run fails', false)
    .option('--no-package-json', 'leave package.json dependency fields alone')
    .option('--ignore <glob>', 'extra glob to skip; repeat for more than one', collectIgnore, [])
    .addHelpText(
      'after',
      [
        '',
        'Examples:',
        '  $ npx react-simplikit-codemod mobile-to-root',
        '  $ npx react-simplikit-codemod mobile-to-root src --dry-run',
        '  $ npx react-simplikit-codemod mobile-to-root . --json',
        '',
        'Rewrites files in place and never prompts. Commit or stash first.',
        '',
        'Docs: https://react-simplikit.slash.page',
        'Issues: https://github.com/toss/react-simplikit/issues',
      ].join('\n')
    )
    .exitOverride()
    .action(runCommand);

  return program;
}

function reportFailure(error: unknown): number {
  if (error instanceof CommanderError) {
    return error.exitCode === 0 ? 0 : 2;
  }

  process.stderr.write(`${describeError(error)}\n`);

  if (debugEnabled && error instanceof Error && error.stack !== undefined) {
    process.stderr.write(`${error.stack}\n`);
  }

  return error instanceof UsageError ? 2 : 1;
}

try {
  await buildProgram().parseAsync();
} catch (error) {
  process.exitCode = reportFailure(error);
}
