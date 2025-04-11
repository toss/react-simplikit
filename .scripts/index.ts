import 'dotenv/config';

import { Command } from 'commander';

import { generateDocs } from './commands/generateDocs/index.ts';

export function cli(args: string[]) {
  const program = new Command();

  program.name('react-simplikit').description('CLI tools for react-simplikit projects').version('0.1.0');

  program
    .command('generate-docs <names>')
    .description(
      'Generate documentation from jsdoc comments. If you want to generate multiple files, please separate the names with commas(`,`)'
    )
    .action((names: string) => {
      generateDocs(names.split(','));
    });

  program.parse(args);

  // Show help if no command is provided
  if (!args.slice(2).length) {
    program.outputHelp();
  }
}

cli(process.argv);
