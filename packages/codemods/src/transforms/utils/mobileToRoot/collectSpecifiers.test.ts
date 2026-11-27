import { describe, expect, it } from 'vitest';

import { collectSpecifiers, lineOf, parseSource } from './collectSpecifiers.ts';

// The source text of every specifier found, quotes included, so a test shows exactly what would be rewritten.
function specifiersIn(code: string, fileName = 'input.tsx') {
  return collectSpecifiers(parseSource(code, fileName)).map(hit => code.slice(hit.literal.start, hit.literal.end));
}

describe('parseSource', () => {
  it('parses an angle-bracket cast in a .ts file', () => {
    const code = 'const a = <number>b;';

    expect(() => parseSource(code, 'a.ts')).not.toThrow();
  });

  it('parses JSX in a .js file', () => {
    const code = 'const a = <div />;';

    expect(() => parseSource(code, 'a.js')).not.toThrow();
  });

  it('reads a file without import or export as a sloppy-mode script', () => {
    const code = `var m = require('@react-simplikit/mobile');\nvar octal = 010;\n`;

    expect(specifiersIn(code, 'legacy.js')).toEqual([`'@react-simplikit/mobile'`]);
  });

  it('reads the deprecated import assertion syntax', () => {
    const code = `import data from './a.json' assert { type: 'json' };\nimport { isIOS } from '@react-simplikit/mobile';\n`;

    expect(specifiersIn(code, 'input.ts')).toEqual([`'@react-simplikit/mobile'`]);
  });

  it('falls back to Flow for a .js file the TSX parser rejects', () => {
    const code = `// @flow\nimport { isIOS } from '@react-simplikit/mobile';\ntype Props = {| name: string |};\n`;

    expect(specifiersIn(code, 'flow.js')).toEqual([`'@react-simplikit/mobile'`]);
  });

  it('does not fall back to Flow outside JavaScript files', () => {
    const code = `type Props = {| name: string |};`;

    expect(() => parseSource(code, 'flow.tsx')).toThrow(SyntaxError);
  });

  it('throws on syntax no parser can read in a .ts file', () => {
    const code = `import broken from someIdentifier;`;

    expect(() => parseSource(code, 'input.ts')).toThrow(SyntaxError);
  });

  it('throws the TSX error when the Flow fallback fails too', () => {
    const code = `import broken from someIdentifier;`;

    expect(() => parseSource(code, 'input.js')).toThrow(SyntaxError);
  });
});

describe('lineOf', () => {
  it('reports line 1 for the first character', () => {
    const code = 'const a = 1;\nconst b = 2;\n';

    expect(lineOf(code, 0)).toBe(1);
  });

  it('counts the lines before the position', () => {
    const code = 'const a = 1;\nconst b = 2;\n';

    expect(lineOf(code, 13)).toBe(2);
  });
});

describe('collectSpecifiers — what it finds', () => {
  it('finds a named import', () => {
    const code = `import { useKeyboardHeight } from '@react-simplikit/mobile';`;

    expect(specifiersIn(code)).toEqual([`'@react-simplikit/mobile'`]);
  });

  it('finds a type-only import', () => {
    const code = `import type { SafeAreaInset } from '@react-simplikit/mobile';`;

    expect(specifiersIn(code)).toEqual([`'@react-simplikit/mobile'`]);
  });

  it('finds a namespace import', () => {
    const code = `import * as mobile from '@react-simplikit/mobile';`;

    expect(specifiersIn(code)).toEqual([`'@react-simplikit/mobile'`]);
  });

  it('finds a side-effect import', () => {
    const code = `import '@react-simplikit/mobile';`;

    expect(specifiersIn(code)).toEqual([`'@react-simplikit/mobile'`]);
  });

  it('finds a named re-export', () => {
    const code = `export { isIOS } from '@react-simplikit/mobile';`;

    expect(specifiersIn(code)).toEqual([`'@react-simplikit/mobile'`]);
  });

  it('finds a star re-export', () => {
    const code = `export * from '@react-simplikit/mobile';`;

    expect(specifiersIn(code)).toEqual([`'@react-simplikit/mobile'`]);
  });

  it('finds require', () => {
    const code = `const m = require('@react-simplikit/mobile');`;

    expect(specifiersIn(code, 'input.cjs')).toEqual([`'@react-simplikit/mobile'`]);
  });

  it('finds require with a template literal that has no substitutions', () => {
    const code = 'const m = require(`@react-simplikit/mobile`);';

    expect(specifiersIn(code, 'input.cjs')).toEqual(['`@react-simplikit/mobile`']);
  });

  it('finds a dynamic import', () => {
    const code = `const m = await import('@react-simplikit/mobile');`;

    expect(specifiersIn(code)).toEqual([`'@react-simplikit/mobile'`]);
  });

  it('finds an import type node', () => {
    const code = `type I = import('@react-simplikit/mobile').SafeAreaInset;`;

    expect(specifiersIn(code, 'input.ts')).toEqual([`'@react-simplikit/mobile'`]);
  });

  it('finds vi.mock', () => {
    const code = `vi.mock('@react-simplikit/mobile');`;

    expect(specifiersIn(code)).toEqual([`'@react-simplikit/mobile'`]);
  });

  it('finds jest.mock', () => {
    const code = `jest.mock('@react-simplikit/mobile');`;

    expect(specifiersIn(code)).toEqual([`'@react-simplikit/mobile'`]);
  });

  it('finds jest.requireActual', () => {
    const code = `jest.requireActual('@react-simplikit/mobile');`;

    expect(specifiersIn(code)).toEqual([`'@react-simplikit/mobile'`]);
  });

  it('finds vi.doUnmock', () => {
    const code = `vi.doUnmock('@react-simplikit/mobile');`;

    expect(specifiersIn(code)).toEqual([`'@react-simplikit/mobile'`]);
  });

  it('finds jest.setMock', () => {
    const code = `jest.setMock('@react-simplikit/mobile', {});`;

    expect(specifiersIn(code)).toEqual([`'@react-simplikit/mobile'`]);
  });

  it('finds jest.createMockFromModule', () => {
    const code = `jest.createMockFromModule('@react-simplikit/mobile');`;

    expect(specifiersIn(code)).toEqual([`'@react-simplikit/mobile'`]);
  });

  it('finds jest.genMockFromModule', () => {
    const code = `jest.genMockFromModule('@react-simplikit/mobile');`;

    expect(specifiersIn(code)).toEqual([`'@react-simplikit/mobile'`]);
  });

  it('finds jest.deepUnmock', () => {
    const code = `jest.deepUnmock('@react-simplikit/mobile');`;

    expect(specifiersIn(code)).toEqual([`'@react-simplikit/mobile'`]);
  });

  it('attaches the declaration to an import and not to a re-export', () => {
    const code = [
      `import { isIOS } from '@react-simplikit/mobile';`,
      `export { isAndroid } from '@react-simplikit/mobile';`,
    ].join('\n');

    const [importHit, exportHit] = collectSpecifiers(parseSource(code, 'input.ts'));

    expect(importHit?.declaration).toBeDefined();
    expect(exportHit?.declaration).toBeUndefined();
  });
});

describe('collectSpecifiers — what it leaves alone', () => {
  it('ignores the root package', () => {
    const code = `import { useToggle } from 'react-simplikit';`;

    expect(specifiersIn(code)).toEqual([]);
  });

  it('ignores a subpath of the old package', () => {
    const code = `import { x } from '@react-simplikit/mobile/extra';`;

    expect(specifiersIn(code)).toEqual([]);
  });

  it('ignores an import type node for another package', () => {
    const code = `type X = import('react').FC;`;

    expect(specifiersIn(code, 'input.ts')).toEqual([]);
  });

  it('ignores the name in a plain string', () => {
    const code = `const label = '@react-simplikit/mobile';`;

    expect(specifiersIn(code)).toEqual([]);
  });

  it('ignores the name as an argument to an unrelated function', () => {
    const code = `describe('@react-simplikit/mobile', () => {});`;

    expect(specifiersIn(code)).toEqual([]);
  });

  it('ignores a local re-export without a source', () => {
    const code = `const foo = 1;\nexport { foo };`;

    expect(specifiersIn(code)).toEqual([]);
  });

  it('ignores mock on another object', () => {
    const code = `other.mock('@react-simplikit/mobile');`;

    expect(specifiersIn(code)).toEqual([]);
  });

  it('ignores a vi method that does not take a module', () => {
    const code = `vi.spyOn('@react-simplikit/mobile');`;

    expect(specifiersIn(code)).toEqual([]);
  });

  it('ignores a nested member call', () => {
    const code = `a.b.mock('@react-simplikit/mobile');`;

    expect(specifiersIn(code)).toEqual([]);
  });

  it('ignores a computed member call', () => {
    const code = `vi['mock']('@react-simplikit/mobile');`;

    expect(specifiersIn(code)).toEqual([]);
  });

  it('ignores a call without arguments', () => {
    const code = `noArgs();`;

    expect(specifiersIn(code)).toEqual([]);
  });

  it('ignores a template literal with substitutions', () => {
    const code = 'require(`${prefix}/mobile`);';

    expect(specifiersIn(code, 'input.cjs')).toEqual([]);
  });

  it('ignores a template literal naming another package', () => {
    const code = 'const m = require(`react-simplikit`);';

    expect(specifiersIn(code, 'input.cjs')).toEqual([]);
  });
});
