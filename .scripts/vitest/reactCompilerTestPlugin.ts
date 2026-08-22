import { transformSync } from '@babel/core';
import { createRequire } from 'node:module';

// Resolved to absolute paths rather than passed by name: under Yarn PnP, Babel's own
// resolution runs relative to the file being compiled (inside `packages/*/src`), which
// cannot see these packages. Vite bundles this file into each package's vitest config
// while preserving the original `import.meta.url`, and both packages declare these
// devDependencies, so `createRequire` resolves in either context.
const localRequire = createRequire(import.meta.url);
const PRESET_TYPESCRIPT = localRequire.resolve('@babel/preset-typescript');
const PRESET_REACT = localRequire.resolve('@babel/preset-react');
const REACT_COMPILER = localRequire.resolve('babel-plugin-react-compiler');

// Matches .scripts/verify-compiler/index.ts. Both `'18'` and `'19'` produce identical
// diagnostics for this codebase; the tests run against the React 19 devDependency.
const TARGET = '19';

// Structural type instead of vite's `Plugin`: `vite` is not a declared dependency at the
// workspace root, so importing its types would break under Yarn PnP.
type ReactCompilerTestPlugin = {
  name: string;
  enforce: 'pre';
  transform: (code: string, id: string) => { code: string; map: unknown } | null;
};

// Mirrors the globs in .scripts/verify-compiler/index.ts: only package source is compiled.
// Test files, test utilities, and setup files stay uncompiled — they play the role of the
// consumer application.
function isCompilableSourceFile(filePath: string): boolean {
  return (
    /\.tsx?$/.test(filePath) &&
    filePath.includes('/src/') &&
    !/\.(spec|test)\./.test(filePath) &&
    !/\/(test|test-utils)\//.test(filePath)
  );
}

/**
 * Vite plugin that runs the React Compiler over package source before Vitest executes the
 * suite, so the same tests prove behavioral equivalence between compiled and uncompiled
 * code (Phase 2 of #421).
 */
export function reactCompilerTestPlugin(): ReactCompilerTestPlugin {
  return {
    name: 'react-simplikit:react-compiler-test',
    enforce: 'pre',
    transform(code, id) {
      const [filePath] = id.split('?');

      if (!isCompilableSourceFile(filePath)) {
        return null;
      }

      const isTsx = filePath.endsWith('.tsx');

      const result = transformSync(code, {
        filename: filePath,
        babelrc: false,
        configFile: false,
        sourceMaps: true,
        presets: [
          [PRESET_TYPESCRIPT, { isTSX: isTsx, allExtensions: true }],
          // Only for `.tsx`: the JSX parser reads a generic arrow such as `<T>(value: T) => T`
          // in a `.ts` file as an unclosed JSX element.
          ...(isTsx ? [[PRESET_REACT, { runtime: 'automatic' }]] : []),
        ],
        // `panicThreshold` is intentionally omitted: the default `'none'` is what production
        // consumers run — nothing throws, `'use no memo'` functions are skipped, and
        // everything compilable gets compiled.
        plugins: [[REACT_COMPILER, { target: TARGET }]],
      });

      if (result?.code == null) {
        return null;
      }

      return { code: result.code, map: result.map };
    },
  };
}
