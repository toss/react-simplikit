import dotenv from 'dotenv';
import path from 'path';

import { Command } from 'commander';

import { getRootPath } from './utils/getRootPath.ts';

// Load .env from project root
dotenv.config({ path: path.join(getRootPath(), '.env') });

import { generateDocs } from './commands/generateDocs/index.ts';
import { scaffold } from './commands/scaffold/index.ts';

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

  program
    .command('scaffold <name>')
    .description('Scaffold a new hook, component or util')
    .option('--t, --type <type>', 'The type of implementation')
    .action((name: string, options: { type: string }) => {
      const type = { c: 'component', h: 'hook', u: 'util', component: 'component', hook: 'hook', util: 'util' }[
        options.type
      ];

      if (type == null || !isValidType(type)) {
        console.error(`Invalid type (${options.type}). type should be one of the following: hook, component, util`);
        return;
      }

      scaffold(name, type);
    });

  program.parse(args);

  // Show help if no command is provided
  if (!args.slice(2).length) {
    program.outputHelp();
  }
}

const isValidType = (value: string): value is 'hook' | 'component' | 'util' =>
  ['hook', 'component', 'util'].includes(value);

cli(process.argv);
