import { Command, CommanderError } from 'commander';
import process from 'node:process';

import manifest from '../package.json';

import { collectFiles } from './runner/collectFiles.ts';
import { runTransform } from './runner/runTransform.ts';
import { MOBILE_PACKAGE_NAME, ROOT_PACKAGE_NAME, TRANSFORM_NAME } from './constants.ts';
import { describeError, UsageError } from './errors.ts';
import { formatHuman, formatJson } from './formatHuman.ts';

type TransformOptions = {
  dryRun: boolean;
  json: boolean;
  debug: boolean;
  packageJson: boolean;
  ignore: string[];
};

function collectIgnore(value: string, previous: string[]) {
  return [...previous, value];
}

async function runCommand(paths: string[], options: TransformOptions) {
  const cwd = process.cwd();
  const files = await collectFiles({ paths, ignore: options.ignore, includePackageJson: options.packageJson, cwd });
  const result = await runTransform({ files, cwd, dryRun: options.dryRun, debug: options.debug });
  const report = options.json ? formatJson(result, options.dryRun) : formatHuman(result, options.dryRun);

  process.stdout.write(`${report}\n`);

  if (result.failed.length === 0) {
    return;
  }

  const count = result.failed.length === 1 ? '1 file' : `${result.failed.length} files`;
  const names = result.failed.map(failure => failure.file).join(', ');

  process.stderr.write(`Could not process ${count}: ${names}\n`);
  process.exitCode = 1;
}

function reportFailure(error: unknown, debug: boolean) {
  if (error instanceof CommanderError) {
    return error.exitCode === 0 ? 0 : 2;
  }

  process.stderr.write(`${describeError(error)}\n`);

  if (debug && error instanceof Error && error.stack !== undefined) {
    process.stderr.write(`${error.stack}\n`);
  }

  return error instanceof UsageError ? 2 : 1;
}

const program = new Command()
  .name('react-simplikit-codemod')
  .description('Codemods for migrating react-simplikit entry points')
  .version(manifest.version)
  .showHelpAfterError(`Run \`react-simplikit-codemod ${TRANSFORM_NAME}\` to migrate a project.`)
  .exitOverride();

const transform = program
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

try {
  await program.parseAsync();
} catch (error) {
  process.exitCode = reportFailure(error, transform.opts().debug === true);
}
