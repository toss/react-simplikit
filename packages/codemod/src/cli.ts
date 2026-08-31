import { Command } from 'commander';
import { readFileSync } from 'node:fs';

// Resolved against this file, never `process.cwd()`: the CLI runs from the user's
// project directory. Read rather than imported, so no JSON module assertion is needed.
const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {
  version: string;
};

const program = new Command();

program
  .name('react-simplikit-codemod')
  .description('Codemods for migrating react-simplikit entry points')
  .version(version);

program.parse();
