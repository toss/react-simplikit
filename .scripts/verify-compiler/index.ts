import { transformSync } from '@babel/core';
import fg from 'fast-glob';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import { getRootPath } from '../utils/getRootPath.ts';

// Resolved to an absolute path rather than passed by name: under Yarn PnP, Babel's own
// plugin resolution runs relative to the file being compiled (inside `packages/*`), which
// cannot see a devDependency hoisted to the workspace root.
const REACT_COMPILER = createRequire(import.meta.url).resolve('babel-plugin-react-compiler');

const SOURCE_GLOBS = ['packages/*/src/**/*.ts', 'packages/*/src/**/*.tsx'];
const IGNORED_GLOBS = ['**/*.spec.*', '**/*.test.*', '**/test/**', '**/test-utils/**'];

// Both `'18'` and `'19'` produce identical diagnostics for this codebase, so the newer
// target is used. Revisit if the compatibility surface ever diverges between majors.
const TARGET = '19';

type Pass = {
  name: string;
  blocking: boolean;
  panicThreshold: 'critical_errors' | 'all_errors';
  // `null` keeps the compiler's built-in list of React ESLint rules whose suppression makes
  // it bail; `[]` disables that bail entirely.
  eslintSuppressionRules: string[] | null;
};

const PASSES: Pass[] = [
  {
    // Mirrors what a consumer with a raised `panicThreshold` actually hits, which is the
    // failure this gate exists to prevent. A `'use no memo'` directive stops the throw
    // without silencing the diagnostic, so throwing — not diagnostic count — is the signal.
    name: 'blocking (critical_errors, consumer-faithful)',
    blocking: true,
    panicThreshold: 'critical_errors',
    eslintSuppressionRules: null,
  },
  {
    // Non-blocking, and deliberately stricter on two axes: `all_errors` surfaces `Todo`
    // diagnostics consumers never hit, and disabling the suppression bail reveals problems
    // that a `react-hooks/*` suppression would otherwise mask. Opted-out functions stay
    // invisible here — the directive suppresses the throw in every configuration.
    name: 'informational (all_errors, suppression bail off)',
    blocking: false,
    panicThreshold: 'all_errors',
    eslintSuppressionRules: [],
  },
];

type Failure = { file: string; message: string };

function compileFile(absolutePath: string, pass: Pass): string | null {
  const isTsx = absolutePath.endsWith('.tsx');

  try {
    transformSync(fs.readFileSync(absolutePath, 'utf8'), {
      filename: absolutePath,
      babelrc: false,
      configFile: false,
      presets: [
        ['@babel/preset-typescript', { isTSX: isTsx, allExtensions: true }],
        // Only for `.tsx`: the JSX parser reads a generic arrow such as `<T>(value: T) => T`
        // in a `.ts` file as an unclosed JSX element.
        ...(isTsx ? [['@babel/preset-react', { runtime: 'automatic' }]] : []),
      ],
      plugins: [
        [
          REACT_COMPILER,
          {
            target: TARGET,
            panicThreshold: pass.panicThreshold,
            ...(pass.eslintSuppressionRules === null ? {} : { eslintSuppressionRules: pass.eslintSuppressionRules }),
          },
        ],
      ],
    });

    return null;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

function runPass(files: string[], pass: Pass, rootPath: string): Failure[] {
  const failures: Failure[] = [];

  for (const absolutePath of files) {
    const message = compileFile(absolutePath, pass);

    if (message !== null) {
      failures.push({ file: path.relative(rootPath, absolutePath), message });
    }
  }

  const label = `${pass.name} — ${files.length} files`;

  if (failures.length === 0) {
    console.log(`✅ ${label}`);
  } else {
    console.log(`${pass.blocking ? '❌' : '⚠️ '} ${label}`);

    for (const failure of failures) {
      console.log(`\n  ${failure.file}`);
      console.log(failure.message.replace(/^/gm, '    '));
    }

    console.log('');
  }

  return failures;
}

function main() {
  const rootPath = getRootPath();
  const files = fg.sync(SOURCE_GLOBS, { cwd: rootPath, absolute: true, ignore: IGNORED_GLOBS }).sort();

  if (files.length === 0) {
    console.error('🚨 Scanned 0 source files — the globs in this check no longer match the repository layout.');
    process.exit(1);
  }

  let hasBlockingFailure = false;

  for (const pass of PASSES) {
    const failures = runPass(files, pass, rootPath);

    if (failures.length > 0 && pass.blocking) {
      hasBlockingFailure = true;
    }
  }

  if (hasBlockingFailure) {
    console.error(
      'verify-compiler failed. Fix the violation, or opt the offending function out with a ' +
        "`'use no memo'` directive and a comment explaining why."
    );
    process.exit(1);
  }
}

main();
