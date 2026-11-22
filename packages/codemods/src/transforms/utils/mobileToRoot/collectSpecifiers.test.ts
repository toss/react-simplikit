import { describe, expect, it } from 'vitest';

import { collectSpecifiers, lineOf, parseSource } from './collectSpecifiers.ts';

function kindsOf(code: string, fileName = 'input.tsx'): string[] {
  return collectSpecifiers(parseSource(code, fileName)).map(hit => hit.kind);
}

describe('parseSource', () => {
  it('parses angle-bracket casts in .ts files and JSX in .js files', () => {
    expect(() => parseSource('const a = <number>b;', 'a.ts')).not.toThrow();
    expect(() => parseSource('const a = <div />;', 'a.js')).not.toThrow();
  });

  it('throws on syntax the parser cannot read', () => {
    expect(() => parseSource(`import broken from someIdentifier;`, 'input.ts')).toThrow();
  });

  it('reads a CommonJS file without import or export as sloppy-mode script', () => {
    const code = `var m = require('@react-simplikit/mobile');\nvar octal = 010;\n`;

    expect(kindsOf(code, 'legacy.js')).toEqual(['require']);
  });

  it('reads the deprecated import assertion syntax', () => {
    const code = `import data from './a.json' assert { type: 'json' };\nimport { isIOS } from '@react-simplikit/mobile';\n`;

    expect(kindsOf(code, 'input.ts')).toEqual(['import']);
  });

  it('falls back to Flow for a .js file the TSX parser rejects', () => {
    const code = `// @flow\nimport { isIOS } from '@react-simplikit/mobile';\ntype Props = {| name: string |};\n`;

    expect(kindsOf(code, 'flow.js')).toEqual(['import']);
  });

  it('does not fall back to Flow outside JavaScript files', () => {
    expect(() => parseSource(`type Props = {| name: string |};`, 'flow.tsx')).toThrow();
  });

  it('reports the TSX error when the Flow fallback fails too', () => {
    expect(() => parseSource(`import broken from someIdentifier;`, 'input.js')).toThrow(SyntaxError);
  });
});

describe('lineOf', () => {
  it('reports 1-based line numbers', () => {
    const code = 'const a = 1;\nconst b = 2;\n';

    expect(lineOf(code, 0)).toBe(1);
    expect(lineOf(code, code.indexOf('const b'))).toBe(2);
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
    expect(kindsOf(`vi['mock']('@react-simplikit/mobile');`)).toEqual([]);
    expect(kindsOf(`require(\`\${prefix}/mobile\`);`, 'input.cjs')).toEqual([]);
  });

  it('finds a template literal specifier without substitutions', () => {
    expect(kindsOf(`const m = require(\`@react-simplikit/mobile\`);`, 'input.cjs')).toEqual(['require']);
    expect(kindsOf(`const m = require(\`react-simplikit\`);`, 'input.cjs')).toEqual([]);
  });
});
