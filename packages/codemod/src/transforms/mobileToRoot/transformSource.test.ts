import { describe, expect, it } from 'vitest';

import { transformSource } from './transformSource.ts';

describe('transformSource', () => {
  it('rewrites a named import to the root package', () => {
    const result = transformSource(`import { useKeyboardHeight } from '@react-simplikit/mobile';\n`, 'a.tsx');

    expect(result.code).toBe(`import { useKeyboardHeight } from 'react-simplikit';\n`);
    expect(result.changes).toEqual([{ line: 1, kind: 'import' }]);
  });

  it('preserves the original quote style', () => {
    expect(transformSource(`import { isIOS } from "@react-simplikit/mobile";\n`, 'a.ts').code).toBe(
      `import { isIOS } from "react-simplikit";\n`
    );
  });

  it('preserves formatting, comments and blank lines around the edit', () => {
    const input = [
      `// keep this comment`,
      ``,
      `import {`,
      `  useSafeAreaInset,   // trailing note`,
      `} from '@react-simplikit/mobile';`,
      ``,
    ].join('\n');

    expect(transformSource(input, 'a.tsx').code).toBe(input.replace('@react-simplikit/mobile', 'react-simplikit'));
  });

  it('rewrites every specifier form in one file, reported in line order', () => {
    const input = [
      `import { isIOS } from '@react-simplikit/mobile';`,
      `export { isAndroid } from '@react-simplikit/mobile';`,
      `const later = await import('@react-simplikit/mobile');`,
      `vi.mock('@react-simplikit/mobile');`,
    ].join('\n');

    const result = transformSource(input, 'a.ts');

    expect(result.code).not.toContain('@react-simplikit/mobile');
    expect(result.changes).toEqual([
      { line: 1, kind: 'import' },
      { line: 2, kind: 'export' },
      { line: 3, kind: 'dynamic-import' },
      { line: 4, kind: 'mock' },
    ]);
  });

  it('rewrites a require call in a cjs file', () => {
    expect(transformSource(`const m = require('@react-simplikit/mobile');\n`, 'a.cjs').code).toBe(
      `const m = require('react-simplikit');\n`
    );
  });

  it('rewrites an import type node', () => {
    expect(transformSource(`type I = import('@react-simplikit/mobile').SafeAreaInset;\n`, 'a.ts').code).toBe(
      `type I = import('react-simplikit').SafeAreaInset;\n`
    );
  });

  it('returns the input untouched when the package name never appears', () => {
    const input = `import { useToggle } from 'react-simplikit';\n`;
    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(input);
    expect(result.changes).toEqual([]);
  });

  it('returns the input untouched when the package name appears only in a plain string', () => {
    const input = `const docs = 'see @react-simplikit/mobile';\n`;
    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(input);
    expect(result.changes).toEqual([]);
  });
});

describe('transformSource — merging with an existing react-simplikit import', () => {
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
    expect(result.changes).toEqual([{ line: 2, kind: 'merge' }]);
  });

  it('preserves aliases and inline type modifiers when merging', () => {
    const input = [
      `import { useToggle } from 'react-simplikit';`,
      `import { isIOS as isApple, type SafeAreaInset } from '@react-simplikit/mobile';`,
      ``,
    ].join('\n');

    expect(transformSource(input, 'a.ts').code).toBe(
      [`import { useToggle, isIOS as isApple, type SafeAreaInset } from 'react-simplikit';`, ``].join('\n')
    );
  });

  it('drops a binding the target already imports', () => {
    const input = [
      `import { isServer, useToggle } from 'react-simplikit';`,
      `import { isIOS, isServer } from '@react-simplikit/mobile';`,
      ``,
    ].join('\n');

    expect(transformSource(input, 'a.ts').code).toBe(
      [`import { isServer, useToggle, isIOS } from 'react-simplikit';`, ``].join('\n')
    );
  });

  it('merges several mobile imports into one target', () => {
    const input = [
      `import { useToggle } from 'react-simplikit';`,
      `import { isIOS } from '@react-simplikit/mobile';`,
      `import { isAndroid } from '@react-simplikit/mobile';`,
      ``,
    ].join('\n');

    expect(transformSource(input, 'a.ts').code).toBe(
      [`import { useToggle, isIOS, isAndroid } from 'react-simplikit';`, ``].join('\n')
    );
  });

  it('keeps a type-only import separate from a value import', () => {
    const input = [
      `import { useToggle } from 'react-simplikit';`,
      `import type { SafeAreaInset } from '@react-simplikit/mobile';`,
      ``,
    ].join('\n');

    expect(transformSource(input, 'a.ts').code).toBe(
      [
        `import { useToggle } from 'react-simplikit';`,
        `import type { SafeAreaInset } from 'react-simplikit';`,
        ``,
      ].join('\n')
    );
  });

  it('merges a type-only import into a type-only target', () => {
    const input = [
      `import type { UseToggleReturn } from 'react-simplikit';`,
      `import type { SafeAreaInset } from '@react-simplikit/mobile';`,
      ``,
    ].join('\n');

    expect(transformSource(input, 'a.ts').code).toBe(
      [`import type { UseToggleReturn, SafeAreaInset } from 'react-simplikit';`, ``].join('\n')
    );
  });

  it('keeps a statement that shares its line with another statement', () => {
    const input = `import { useToggle } from 'react-simplikit';\nimport { isIOS } from '@react-simplikit/mobile'; const x = 1;\n`;

    expect(transformSource(input, 'a.ts').code).toBe(
      `import { useToggle, isIOS } from 'react-simplikit';\n const x = 1;\n`
    );
  });

  it('handles a merged import on the last line without a trailing newline', () => {
    const input = `import { useToggle } from 'react-simplikit';\nimport { isIOS } from '@react-simplikit/mobile';`;

    expect(transformSource(input, 'a.ts').code).toBe(`import { useToggle, isIOS } from 'react-simplikit';\n`);
  });

  it('handles a merged import on the very first line', () => {
    const input = [
      `import { isIOS } from '@react-simplikit/mobile';`,
      `import { useToggle } from 'react-simplikit';`,
      ``,
    ].join('\n');

    expect(transformSource(input, 'a.ts').code).toBe(
      [`import { useToggle, isIOS } from 'react-simplikit';`, ``].join('\n')
    );
  });

  it('fills an empty named list on the target', () => {
    const input = [`import {} from 'react-simplikit';`, `import { isIOS } from '@react-simplikit/mobile';`, ``].join(
      '\n'
    );

    expect(transformSource(input, 'a.ts').code).toBe([`import {isIOS} from 'react-simplikit';`, ``].join('\n'));
  });

  it('leaves an import carrying a comment as its own statement rather than losing it', () => {
    // Merging copies specifier text only, so folding this in would drop the note.
    const input = [
      `import { useToggle } from 'react-simplikit';`,
      `import {`,
      `  useKeyboardHeight, // needed for the sheet offset`,
      `} from '@react-simplikit/mobile';`,
      ``,
    ].join('\n');

    const result = transformSource(input, 'a.ts');

    expect(result.code).toBe(input.replace('@react-simplikit/mobile', 'react-simplikit'));
    // Line 4 is where `} from '...'` sits — changes point at the edited specifier,
    // not at the line the statement starts on.
    expect(result.changes).toEqual([{ line: 4, kind: 'import' }]);
  });

  it('deletes the mobile import when every binding is already present', () => {
    const input = [
      `import { isIOS } from 'react-simplikit';`,
      `import { isIOS } from '@react-simplikit/mobile';`,
      ``,
    ].join('\n');

    expect(transformSource(input, 'a.ts').code).toBe([`import { isIOS } from 'react-simplikit';`, ``].join('\n'));
  });
});
