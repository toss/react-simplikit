import ts from 'typescript';
import { describe, expect, it } from 'vitest';

import { collectSpecifiers, lineOf, parseSource } from './collectSpecifiers.ts';

function kindsOf(code: string, fileName = 'input.tsx'): string[] {
  return collectSpecifiers(parseSource(code, fileName)).map(hit => hit.kind);
}

describe('parseSource', () => {
  it('lets TypeScript pick the script kind from the extension', () => {
    expect(parseSource('const a = 1;', 'a.ts').languageVariant).toBe(ts.LanguageVariant.Standard);
    expect(parseSource('const a = 1;', 'a.cts').languageVariant).toBe(ts.LanguageVariant.Standard);
    expect(parseSource('const a = 1;', 'a.tsx').languageVariant).toBe(ts.LanguageVariant.JSX);
    expect(parseSource('const a = 1;', 'a.js').languageVariant).toBe(ts.LanguageVariant.JSX);
  });
});

describe('lineOf', () => {
  it('reports 1-based line numbers', () => {
    const sourceFile = parseSource('const a = 1;\nconst b = 2;\n', 'a.ts');

    expect(lineOf(sourceFile, 0)).toBe(1);
    expect(lineOf(sourceFile, sourceFile.text.indexOf('const b'))).toBe(2);
  });
});

describe('collectSpecifiers', () => {
  it('finds every import form', () => {
    expect(kindsOf(`import { useKeyboardHeight } from '@react-simplikit/mobile';`)).toEqual(['import']);
    expect(kindsOf(`import type { SafeAreaInset } from '@react-simplikit/mobile';`)).toEqual(['import']);
    expect(kindsOf(`import * as mobile from '@react-simplikit/mobile';`)).toEqual(['import']);
    expect(kindsOf(`import '@react-simplikit/mobile';`)).toEqual(['import']);
  });

  it('finds re-exports', () => {
    expect(kindsOf(`export { isIOS } from '@react-simplikit/mobile';`)).toEqual(['export']);
    expect(kindsOf(`export * from '@react-simplikit/mobile';`)).toEqual(['export']);
  });

  it('finds require and dynamic import', () => {
    expect(kindsOf(`const m = require('@react-simplikit/mobile');`, 'input.cjs')).toEqual(['require']);
    expect(kindsOf(`const m = await import('@react-simplikit/mobile');`)).toEqual(['dynamic-import']);
  });

  it('finds an import type node in type position', () => {
    expect(kindsOf(`type I = import('@react-simplikit/mobile').SafeAreaInset;`, 'input.ts')).toEqual(['import-type']);
  });

  it('finds vitest and jest module mocks', () => {
    expect(kindsOf(`vi.mock('@react-simplikit/mobile');`)).toEqual(['mock']);
    expect(kindsOf(`jest.mock('@react-simplikit/mobile');`)).toEqual(['mock']);
    expect(kindsOf(`jest.requireActual('@react-simplikit/mobile');`)).toEqual(['mock']);
  });

  it('attaches the declaration only for import declarations', () => {
    const hits = collectSpecifiers(
      parseSource(
        [
          `import { isIOS } from '@react-simplikit/mobile';`,
          `export { isAndroid } from '@react-simplikit/mobile';`,
        ].join('\n'),
        'input.ts'
      )
    );

    expect(hits[0]?.declaration).toBeDefined();
    expect(hits[1]?.declaration).toBeUndefined();
  });

  it('ignores anything that is not a specifier for the old package', () => {
    expect(kindsOf(`import { useToggle } from 'react-simplikit';`)).toEqual([]);
    expect(kindsOf(`import { x } from '@react-simplikit/mobile/extra';`)).toEqual([]);
    expect(kindsOf(`type X = import('react').FC;`, 'input.ts')).toEqual([]);

    expect(kindsOf(`const label = '@react-simplikit/mobile';`)).toEqual([]);
    expect(kindsOf(`describe('@react-simplikit/mobile', () => {});`)).toEqual([]);

    expect(kindsOf(`const foo = 1;\nexport { foo };`)).toEqual([]);

    expect(kindsOf(`other.mock('@react-simplikit/mobile');`)).toEqual([]);
    expect(kindsOf(`vi.spyOn('@react-simplikit/mobile');`)).toEqual([]);
    expect(kindsOf(`a.b.mock('@react-simplikit/mobile');`)).toEqual([]);
    expect(kindsOf(`noArgs();`)).toEqual([]);
  });

  it('degrades to no-op on malformed syntax the parser recovers from', () => {
    expect(kindsOf(`import broken from someIdentifier;`, 'input.ts')).toEqual([]);
    expect(kindsOf(`type Bad = import(Foo).Bar;`, 'input.ts')).toEqual([]);
  });
});
