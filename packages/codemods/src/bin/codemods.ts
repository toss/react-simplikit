/**
 * Copyright 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
// Based on https://github.com/reactjs/react-codemod

import { Command } from 'commander';

import packageJson from '../../package.json';

import { TRANSFORMER_INQUIRER_CHOICES, transformRunner } from './transformRunner.ts';

const program = new Command(packageJson.name);

program
  .description(packageJson.description)
  .version(packageJson.version, '-v, --version', 'Output the current version of @react-simplikit/codemods.')
  .argument(
    '[codemod]',
    'Codemod slug to run. See "https://github.com/toss/react-simplikit/tree/main/packages/codemods"'
  )
  .argument('[path]', 'Path to source directory.')
  .usage('[codemod] [path]')
  .helpOption('-h, --help', 'Display this help message.')
  .option('-d, --dry', 'Dry run (no changes are made to files)')
  .option('-p, --print', 'Print transformed files to stdout, useful for development')
  .option('-f, --force', 'Bypass Git safety checks and forcibly run codemods')
  .option('-j, --jscodeshift <options>', '(Advanced) Pass options directly to jscodeshift')
  .addHelpText(
    'after',
    [
      '',
      'Transforms:',
      ...TRANSFORMER_INQUIRER_CHOICES.map(({ title, description }) => `  ${title}  ${description}`),
    ].join('\n')
  )
  .action(transformRunner);

program.parse(process.argv);
