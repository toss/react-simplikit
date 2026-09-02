import { describe, expect, it } from 'vitest';

import { collectSpecifiers, parseSource } from './collectSpecifiers.ts';
import { buildMergeSplices, type MergeResult } from './mergeImports.ts';

function merge(lines: readonly string[], fileName = 'a.ts'): MergeResult {
  const sourceFile = parseSource(lines.join('\n'), fileName);

  return buildMergeSplices(sourceFile, collectSpecifiers(sourceFile));
}

const ROOT_IMPORT = `import { useToggle } from 'react-simplikit';`;

describe('buildMergeSplices', () => {
  it('produces nothing when the file has no react-simplikit import to merge into', () => {
    const result = merge([`import { isIOS } from '@react-simplikit/mobile';`]);

    expect(result.splices).toEqual([]);
    expect(result.changes).toEqual([]);
    expect(result.mergedDeclarations.size).toBe(0);
  });

  it('produces a delete and an insert when a mergeable target exists', () => {
    const result = merge([ROOT_IMPORT, `import { isIOS } from '@react-simplikit/mobile';`, ``]);

    expect(result.splices).toHaveLength(2);
    expect(result.changes).toEqual([{ line: 2, kind: 'merge' }]);
    expect(result.mergedDeclarations.size).toBe(1);
  });

  it('skips mobile imports that are not a plain named list', () => {
    const namespaceImport = merge([ROOT_IMPORT, `import * as mobile from '@react-simplikit/mobile';`]);
    const sideEffectImport = merge([ROOT_IMPORT, `import '@react-simplikit/mobile';`]);
    const defaultImport = merge([ROOT_IMPORT, `import mobile from '@react-simplikit/mobile';`]);
    const defaultAndNamed = merge([ROOT_IMPORT, `import mobile, { isIOS } from '@react-simplikit/mobile';`]);

    expect(namespaceImport.splices).toEqual([]);
    expect(sideEffectImport.splices).toEqual([]);
    expect(defaultImport.splices).toEqual([]);
    expect(defaultAndNamed.splices).toEqual([]);
  });

  it('skips hits that are not import declarations', () => {
    expect(merge([ROOT_IMPORT, `export { isIOS } from '@react-simplikit/mobile';`]).splices).toEqual([]);
  });

  it('skips targets that cannot receive a named binding', () => {
    const namespaceTarget = merge([
      `import * as root from 'react-simplikit';`,
      `import { isIOS } from '@react-simplikit/mobile';`,
    ]);
    const brokenTarget = merge([
      `import { useToggle } from someIdentifier;`,
      `import { isIOS } from '@react-simplikit/mobile';`,
    ]);

    expect(namespaceTarget.splices).toEqual([]);
    expect(brokenTarget.splices).toEqual([]);
  });

  it('refuses to merge across a type-only mismatch in either direction', () => {
    const typeIntoValue = merge([ROOT_IMPORT, `import type { SafeAreaInset } from '@react-simplikit/mobile';`]);
    const valueIntoType = merge([
      `import type { UseToggleReturn } from 'react-simplikit';`,
      `import { isIOS } from '@react-simplikit/mobile';`,
    ]);

    expect(typeIntoValue.splices).toEqual([]);
    expect(valueIntoType.splices).toEqual([]);
  });

  it('merges when both sides are type-only', () => {
    const result = merge([
      `import type { UseToggleReturn } from 'react-simplikit';`,
      `import type { SafeAreaInset } from '@react-simplikit/mobile';`,
    ]);

    expect(result.mergedDeclarations.size).toBe(1);
  });

  it('emits one insert for two mobile imports folded into the same target', () => {
    const result = merge([
      ROOT_IMPORT,
      `import { isIOS } from '@react-simplikit/mobile';`,
      `import { isAndroid } from '@react-simplikit/mobile';`,
    ]);

    expect(result.splices).toHaveLength(3);
    expect(result.mergedDeclarations.size).toBe(2);
  });

  it('emits no insert when every binding is already on the target', () => {
    const result = merge([
      `import { isIOS } from 'react-simplikit';`,
      `import { isIOS } from '@react-simplikit/mobile';`,
    ]);

    expect(result.splices).toHaveLength(1);
    expect(result.mergedDeclarations.size).toBe(1);
  });
});
