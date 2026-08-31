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
