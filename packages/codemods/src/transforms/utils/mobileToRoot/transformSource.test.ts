import { describe, expect, it } from 'vitest';

import { transformSource } from './transformSource.ts';

describe('transformSource — rewriting in place', () => {
  it('rewrites a named import to the root package', () => {
    const input = `import { useKeyboardHeight } from '@react-simplikit/mobile';\n`;

    const result = transformSource(input, 'a.tsx');

    expect(result.code).toBe(`import { useKeyboardHeight } from 'react-simplikit';\n`);
  });

  it('keeps double quotes', () => {
    const input = `import { isIOS } from "@react-simplikit/mobile";\n`;

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(`import { isIOS } from "react-simplikit";\n`);
  });

  it('keeps comments and blank lines around the edit', () => {
    const input = [
      `// keep this comment`,
      ``,
      `import {`,
      `  useSafeAreaInset,   // trailing note`,
      `} from '@react-simplikit/mobile';`,
      ``,
    ].join('\n');

    const result = transformSource(input, 'a.tsx');

    expect(result.code).toBe(
      [
        `// keep this comment`,
        ``,
        `import {`,
        `  useSafeAreaInset,   // trailing note`,
        `} from 'react-simplikit';`,
        ``,
      ].join('\n')
    );
  });

  it('keeps tab indentation', () => {
    const input = `import {\n\tisIOS,\n} from '@react-simplikit/mobile';\n`;

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(`import {\n\tisIOS,\n} from 'react-simplikit';\n`);
  });

  it('rewrites a re-export', () => {
    const input = `export { isAndroid } from '@react-simplikit/mobile';\n`;

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(`export { isAndroid } from 'react-simplikit';\n`);
  });

  it('rewrites a dynamic import', () => {
    const input = `const later = await import('@react-simplikit/mobile');\n`;

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(`const later = await import('react-simplikit');\n`);
  });

  it('rewrites a require call in a .cjs file', () => {
    const input = `const m = require('@react-simplikit/mobile');\n`;

    const result = transformSource(input, 'a.cjs');

    expect(result.code).toBe(`const m = require('react-simplikit');\n`);
  });

  it('rewrites require.resolve', () => {
    const input = `require.resolve('@react-simplikit/mobile');\n`;

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(`require.resolve('react-simplikit');\n`);
  });

  it('rewrites an import-equals require', () => {
    const input = `import m = require('@react-simplikit/mobile');\n`;

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(`import m = require('react-simplikit');\n`);
  });

  it('rewrites an import type node', () => {
    const input = `type I = import('@react-simplikit/mobile').SafeAreaInset;\n`;

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(`type I = import('react-simplikit').SafeAreaInset;\n`);
  });

  it('rewrites vi.mock', () => {
    const input = `vi.mock('@react-simplikit/mobile');\n`;

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(`vi.mock('react-simplikit');\n`);
  });

  it('rewrites vi.importActual', () => {
    const input = `await vi.importActual('@react-simplikit/mobile');\n`;

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(`await vi.importActual('react-simplikit');\n`);
  });

  it('rewrites vi.importMock', () => {
    const input = `await vi.importMock('@react-simplikit/mobile');\n`;

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(`await vi.importMock('react-simplikit');\n`);
  });

  it('returns a file without the package untouched', () => {
    const input = `import { useToggle } from 'react-simplikit';\n`;

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(`import { useToggle } from 'react-simplikit';\n`);
    expect(result.notes).toEqual([]);
  });

  it('changes nothing on a second run', () => {
    const input = [
      `import { useToggle } from 'react-simplikit';`,
      `import { isIOS } from '@react-simplikit/mobile';`,
      `export { isAndroid } from '@react-simplikit/mobile';`,
      ``,
    ].join('\n');
    const once = transformSource(input, 'a.ts').code;

    const twice = transformSource(once, 'a.ts');

    expect(twice.code).toBe(
      [`import { useToggle, isIOS } from 'react-simplikit';`, `export { isAndroid } from 'react-simplikit';`, ``].join(
        '\n'
      )
    );
    expect(twice.notes).toEqual([]);
  });

  it('throws on a name imported twice, so the file is reported instead of merged', () => {
    const input = [
      `import { useToggle as isIOS } from 'react-simplikit';`,
      `import { isIOS } from '@react-simplikit/mobile';`,
    ].join('\n');

    expect(() => transformSource(input, 'a.ts')).toThrow('already been declared');
  });
});

describe('transformSource — merging into an existing react-simplikit import', () => {
  it('folds the mobile bindings into the existing import and drops the line', () => {
    const input = [
      `import { useToggle } from 'react-simplikit';`,
      `import { isIOS, useKeyboardHeight } from '@react-simplikit/mobile';`,
      ``,
      `export const value = 1;`,
      ``,
    ].join('\n');

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(
      [
        `import { useToggle, isIOS, useKeyboardHeight } from 'react-simplikit';`,
        ``,
        `export const value = 1;`,
        ``,
      ].join('\n')
    );
  });

  it('keeps aliases and inline type modifiers', () => {
    const input = [
      `import { useToggle } from 'react-simplikit';`,
      `import { isIOS as isApple, type SafeAreaInset } from '@react-simplikit/mobile';`,
      ``,
    ].join('\n');

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(`import { useToggle, isIOS as isApple, type SafeAreaInset } from 'react-simplikit';\n`);
  });

  it('merges several mobile imports into one target', () => {
    const input = [
      `import { useToggle } from 'react-simplikit';`,
      `import { isIOS } from '@react-simplikit/mobile';`,
      `import { isAndroid } from '@react-simplikit/mobile';`,
      ``,
    ].join('\n');

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(`import { useToggle, isIOS, isAndroid } from 'react-simplikit';\n`);
  });

  it('merges a type-only import into a type-only target', () => {
    const input = [
      `import type { UseToggleReturn } from 'react-simplikit';`,
      `import type { SafeAreaInset } from '@react-simplikit/mobile';`,
      ``,
    ].join('\n');

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(`import type { UseToggleReturn, SafeAreaInset } from 'react-simplikit';\n`);
  });

  it('merges an import that shares its line with another statement', () => {
    const input = `import { useToggle } from 'react-simplikit';\nimport { isIOS } from '@react-simplikit/mobile'; const x = 1;\n`;

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(`import { useToggle, isIOS } from 'react-simplikit';\n const x = 1;\n`);
  });

  it('merges an import on the last line without a trailing newline', () => {
    const input = `import { useToggle } from 'react-simplikit';\nimport { isIOS } from '@react-simplikit/mobile';`;

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(`import { useToggle, isIOS } from 'react-simplikit';\n`);
  });

  it('merges an import on the first line into a target below it', () => {
    const input = [
      `import { isIOS } from '@react-simplikit/mobile';`,
      `import { useToggle } from 'react-simplikit';`,
      ``,
    ].join('\n');

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(`import { useToggle, isIOS } from 'react-simplikit';\n`);
  });

  it('adds one binding per line to a target written one per line with a trailing comma', () => {
    const input = [
      `import {`,
      `  useDebounce,`,
      `  useLoading,`,
      `} from 'react-simplikit';`,
      `import { isIOS, useKeyboardHeight } from '@react-simplikit/mobile';`,
      ``,
    ].join('\n');

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(
      [
        `import {`,
        `  useDebounce,`,
        `  useLoading,`,
        `  isIOS,`,
        `  useKeyboardHeight,`,
        `} from 'react-simplikit';`,
        ``,
      ].join('\n')
    );
  });

  it('adds one binding per line to a tab-indented target without a trailing comma', () => {
    const input = [
      `import {`,
      `\tuseLoading`,
      `} from 'react-simplikit';`,
      `import { isIOS } from '@react-simplikit/mobile';`,
      ``,
    ].join('\n');

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe([`import {`, `\tuseLoading,`, `\tisIOS`, `} from 'react-simplikit';`, ``].join('\n'));
  });

  it('stays inline when the target bindings share a line under a broken-out brace', () => {
    const input = [
      `import {`,
      `  useDebounce, useLoading`,
      `} from 'react-simplikit';`,
      `import { isIOS } from '@react-simplikit/mobile';`,
      ``,
    ].join('\n');

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(
      [`import {`, `  useDebounce, useLoading, isIOS`, `} from 'react-simplikit';`, ``].join('\n')
    );
  });

  it('fills an empty named list on the target', () => {
    const input = [`import {} from 'react-simplikit';`, `import { isIOS } from '@react-simplikit/mobile';`, ``].join(
      '\n'
    );

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(`import {isIOS} from 'react-simplikit';\n`);
  });

  it('drops an empty mobile import without touching the target', () => {
    const input = [
      `import { useToggle } from 'react-simplikit';`,
      `import {} from '@react-simplikit/mobile';`,
      ``,
    ].join('\n');

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(`import { useToggle } from 'react-simplikit';\n`);
  });

  it('merges when the only comment belongs to the target line', () => {
    const input = [
      `import { useToggle } from 'react-simplikit'; // the root package`,
      `import { isIOS } from '@react-simplikit/mobile';`,
      ``,
    ].join('\n');

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(`import { useToggle, isIOS } from 'react-simplikit'; // the root package\n`);
    expect(result.notes).toEqual([]);
  });

  it('merges under a file banner comment', () => {
    const input = [
      `/** @vitest-environment jsdom */`,
      `import { isIOS } from '@react-simplikit/mobile';`,
      `import { useToggle } from 'react-simplikit';`,
      ``,
    ].join('\n');

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(
      [`/** @vitest-environment jsdom */`, `import { useToggle, isIOS } from 'react-simplikit';`, ``].join('\n')
    );
    expect(result.notes).toEqual([]);
  });
});

describe('transformSource — imports it rewrites in place instead of merging', () => {
  it('keeps a type-only import apart from a value target', () => {
    const input = [
      `import { useToggle } from 'react-simplikit';`,
      `import type { SafeAreaInset } from '@react-simplikit/mobile';`,
      ``,
    ].join('\n');

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(
      [
        `import { useToggle } from 'react-simplikit';`,
        `import type { SafeAreaInset } from 'react-simplikit';`,
        ``,
      ].join('\n')
    );
  });

  it('keeps a value import apart from a type-only target', () => {
    const input = [
      `import type { UseToggleReturn } from 'react-simplikit';`,
      `import { isIOS } from '@react-simplikit/mobile';`,
      ``,
    ].join('\n');

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(
      [`import type { UseToggleReturn } from 'react-simplikit';`, `import { isIOS } from 'react-simplikit';`, ``].join(
        '\n'
      )
    );
  });

  it('keeps a namespace import on its own line, without a note', () => {
    const input = [
      `import { useToggle } from 'react-simplikit';`,
      `import * as m from '@react-simplikit/mobile';`,
      ``,
    ].join('\n');

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(
      [`import { useToggle } from 'react-simplikit';`, `import * as m from 'react-simplikit';`, ``].join('\n')
    );
    expect(result.notes).toEqual([]);
  });

  it('keeps an import with a default binding on its own line', () => {
    const input = [
      `import { useToggle } from 'react-simplikit';`,
      `import mobile, { isIOS } from '@react-simplikit/mobile';`,
      ``,
    ].join('\n');

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(
      [`import { useToggle } from 'react-simplikit';`, `import mobile, { isIOS } from 'react-simplikit';`, ``].join(
        '\n'
      )
    );
  });

  it('keeps a side-effect import on its own line', () => {
    const input = [`import { useToggle } from 'react-simplikit';`, `import '@react-simplikit/mobile';`, ``].join('\n');

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(
      [`import { useToggle } from 'react-simplikit';`, `import 'react-simplikit';`, ``].join('\n')
    );
  });

  it('does not merge into a namespace target', () => {
    const input = [
      `import * as root from 'react-simplikit';`,
      `import { isIOS } from '@react-simplikit/mobile';`,
      ``,
    ].join('\n');

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(
      [`import * as root from 'react-simplikit';`, `import { isIOS } from 'react-simplikit';`, ``].join('\n')
    );
  });

  it('does not merge into a side-effect target', () => {
    const input = [`import 'react-simplikit';`, `import { isIOS } from '@react-simplikit/mobile';`, ``].join('\n');

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe([`import 'react-simplikit';`, `import { isIOS } from 'react-simplikit';`, ``].join('\n'));
  });

  it('never lifts an import out of an ambient module block, without a note', () => {
    const input = [
      `import { useToggle } from 'react-simplikit';`,
      `declare module 'other' {`,
      `  import { isIOS } from '@react-simplikit/mobile';`,
      `  export const c: typeof isIOS;`,
      `}`,
      ``,
    ].join('\n');

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(
      [
        `import { useToggle } from 'react-simplikit';`,
        `declare module 'other' {`,
        `  import { isIOS } from 'react-simplikit';`,
        `  export const c: typeof isIOS;`,
        `}`,
        ``,
      ].join('\n')
    );
    expect(result.notes).toEqual([]);
  });

  it('leaves an import with a comment inside its braces and explains why', () => {
    const input = [
      `import { useToggle } from 'react-simplikit';`,
      `import {`,
      `  useKeyboardHeight, // needed for the sheet offset`,
      `} from '@react-simplikit/mobile';`,
      ``,
    ].join('\n');

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(
      [
        `import { useToggle } from 'react-simplikit';`,
        `import {`,
        `  useKeyboardHeight, // needed for the sheet offset`,
        `} from 'react-simplikit';`,
        ``,
      ].join('\n')
    );
    expect(result.notes).toEqual([{ line: 2, reason: expect.stringContaining('comment') }]);
  });

  it('leaves an import with a trailing comment and explains why', () => {
    const input = [
      `import { useToggle } from 'react-simplikit';`,
      `import { isIOS } from '@react-simplikit/mobile'; // only on mobile`,
      ``,
    ].join('\n');

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(
      [
        `import { useToggle } from 'react-simplikit';`,
        `import { isIOS } from 'react-simplikit'; // only on mobile`,
        ``,
      ].join('\n')
    );
    expect(result.notes).toEqual([{ line: 2, reason: expect.stringContaining('comment') }]);
  });
});

describe('transformSource — comments and line endings around a merge', () => {
  it('leaves an import under a line comment such as @ts-expect-error and explains why', () => {
    const input = [
      `import { useToggle } from 'react-simplikit';`,
      `// @ts-expect-error the stub has no types`,
      `import { isIOS } from '@react-simplikit/mobile';`,
      ``,
    ].join('\n');

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(
      [
        `import { useToggle } from 'react-simplikit';`,
        `// @ts-expect-error the stub has no types`,
        `import { isIOS } from 'react-simplikit';`,
        ``,
      ].join('\n')
    );
    expect(result.notes).toEqual([{ line: 3, reason: expect.stringContaining('comment') }]);
  });

  it('adds a binding with the CRLF line ending the file uses', () => {
    const input = `import {\r\n  useToggle,\r\n} from 'react-simplikit';\r\nimport { isIOS } from '@react-simplikit/mobile';\r\n`;

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(`import {\r\n  useToggle,\r\n  isIOS,\r\n} from 'react-simplikit';\r\n`);
  });
});

describe('transformSource — mentions it cannot rewrite', () => {
  it('reports a moduleNameMapper entry and leaves it', () => {
    const input = `module.exports = { moduleNameMapper: { '^@react-simplikit/mobile$': '<rootDir>/stub.js' } };\n`;

    const result = transformSource(input, 'jest.config.js');

    expect(result.code).toBe(
      `module.exports = { moduleNameMapper: { '^@react-simplikit/mobile$': '<rootDir>/stub.js' } };\n`
    );
    expect(result.notes).toEqual([{ line: 1, reason: expect.stringContaining('could not be rewritten') }]);
  });

  it('reports a plain string naming the package and leaves it', () => {
    const input = `const docs = 'see @react-simplikit/mobile';\n`;

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(`const docs = 'see @react-simplikit/mobile';\n`);
    expect(result.notes).toEqual([{ line: 1, reason: expect.stringContaining('could not be rewritten') }]);
  });

  it('reports a mention left next to an import it did rewrite', () => {
    const input = [
      `import { isIOS } from '@react-simplikit/mobile';`,
      `import extra from '@react-simplikit/mobile/extra';`,
      ``,
    ].join('\n');

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(
      [`import { isIOS } from 'react-simplikit';`, `import extra from '@react-simplikit/mobile/extra';`, ``].join('\n')
    );
    expect(result.notes).toEqual([{ line: 2, reason: expect.stringContaining('could not be rewritten') }]);
  });

  it('stays quiet when every mention was rewritten', () => {
    const input = `import { isIOS } from '@react-simplikit/mobile';\n`;

    const result = transformSource(input, 'a.ts');

    expect(result.notes).toEqual([]);
  });
});
