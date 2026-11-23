import type { API } from 'jscodeshift';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

import transform from '../mobile-to-root.ts';

// Read as bytes on purpose: line endings, a BOM and the final newline are part of what the transform must keep.
function readFixture(fileName: string) {
  return readFileSync(join(__dirname, '../testfixtures/mobile-to-root', fileName), 'utf8');
}

function migrate(path: string, source: string, report = vi.fn()) {
  return transform({ path, source }, { report } as unknown as API);
}

describe('mobile-to-root — rewrites', () => {
  it('folds a mobile import into the root import and leaves a commented one on its own line', () => {
    const report = vi.fn();
    const expected = readFixture('merge.output.tsx');

    const output = migrate('merge.tsx', readFixture('merge.input.tsx'), report);
    const secondRun = migrate('merge.tsx', expected);

    expect(output).toBe(expected);
    expect(secondRun).toBe(expected);
    expect(report).toHaveBeenCalledTimes(1);
  });

  it('appends to a tab-indented import one binding per line', () => {
    const report = vi.fn();
    const expected = readFixture('tabs.output.ts');

    const output = migrate('tabs.ts', readFixture('tabs.input.ts'), report);
    const secondRun = migrate('tabs.ts', expected);

    expect(output).toBe(expected);
    expect(secondRun).toBe(expected);
    expect(report).not.toHaveBeenCalled();
  });

  it('keeps CRLF line endings', () => {
    const report = vi.fn();
    const expected = readFixture('crlf.output.ts');

    const output = migrate('crlf.ts', readFixture('crlf.input.ts'), report);
    const secondRun = migrate('crlf.ts', expected);

    expect(output).toBe(expected);
    expect(secondRun).toBe(expected);
    expect(report).not.toHaveBeenCalled();
  });

  it('keeps a byte order mark', () => {
    const report = vi.fn();
    const expected = readFixture('bom.output.ts');

    const output = migrate('bom.ts', readFixture('bom.input.ts'), report);
    const secondRun = migrate('bom.ts', expected);

    expect(output).toBe(expected);
    expect(secondRun).toBe(expected);
    expect(report).not.toHaveBeenCalled();
  });

  it('rewrites dynamic imports, require.resolve, import types, template literals and re-exports', () => {
    const report = vi.fn();
    const expected = readFixture('specifier-forms.output.ts');

    const output = migrate('specifier-forms.ts', readFixture('specifier-forms.input.ts'), report);
    const secondRun = migrate('specifier-forms.ts', expected);

    expect(output).toBe(expected);
    expect(secondRun).toBe(expected);
    expect(report).not.toHaveBeenCalled();
  });

  it('rewrites vitest mocks and reports the package name left in a test title', () => {
    const report = vi.fn();
    const expected = readFixture('test-mocks.output.tsx');

    const output = migrate('test-mocks.tsx', readFixture('test-mocks.input.tsx'), report);
    const secondRun = migrate('test-mocks.tsx', expected);

    expect(output).toBe(expected);
    expect(secondRun).toBe(expected);
    expect(report).toHaveBeenCalledTimes(1);
  });

  it('rewrites require and jest mocks in a .cjs file', () => {
    const report = vi.fn();
    const expected = readFixture('commonjs.output.cjs');

    const output = migrate('commonjs.cjs', readFixture('commonjs.input.cjs'), report);
    const secondRun = migrate('commonjs.cjs', expected);

    expect(output).toBe(expected);
    expect(secondRun).toBe(expected);
    expect(report).not.toHaveBeenCalled();
  });

  it('rewrites an import with a default binding in place in a .mjs file', () => {
    const report = vi.fn();
    const expected = readFixture('default-import.output.mjs');

    const output = migrate('default-import.mjs', readFixture('default-import.input.mjs'), report);
    const secondRun = migrate('default-import.mjs', expected);

    expect(output).toBe(expected);
    expect(secondRun).toBe(expected);
    expect(report).not.toHaveBeenCalled();
  });

  it('rewrites a declaration file without lifting imports out of declare module', () => {
    const report = vi.fn();
    const expected = readFixture('declaration-file.output.d.ts');

    const output = migrate('declaration-file.d.ts', readFixture('declaration-file.input.d.ts'), report);
    const secondRun = migrate('declaration-file.d.ts', expected);

    expect(output).toBe(expected);
    expect(secondRun).toBe(expected);
    expect(report).not.toHaveBeenCalled();
  });

  it('rewrites import-equals', () => {
    const report = vi.fn();
    const expected = readFixture('import-equals.output.ts');

    const output = migrate('import-equals.ts', readFixture('import-equals.input.ts'), report);
    const secondRun = migrate('import-equals.ts', expected);

    expect(output).toBe(expected);
    expect(secondRun).toBe(expected);
    expect(report).not.toHaveBeenCalled();
  });

  it('parses satisfies, decorators and inline type modifiers', () => {
    const report = vi.fn();
    const expected = readFixture('modern-syntax.output.tsx');

    const output = migrate('modern-syntax.tsx', readFixture('modern-syntax.input.tsx'), report);
    const secondRun = migrate('modern-syntax.tsx', expected);

    expect(output).toBe(expected);
    expect(secondRun).toBe(expected);
    expect(report).not.toHaveBeenCalled();
  });

  it('merges an empty named import and rewrites a side-effect import', () => {
    const report = vi.fn();
    const expected = readFixture('empty-and-side-effect-imports.output.ts');

    const output = migrate(
      'empty-and-side-effect-imports.ts',
      readFixture('empty-and-side-effect-imports.input.ts'),
      report
    );
    const secondRun = migrate('empty-and-side-effect-imports.ts', expected);

    expect(output).toBe(expected);
    expect(secondRun).toBe(expected);
    expect(report).not.toHaveBeenCalled();
  });

  it('merges an import that shares its line with other statements', () => {
    const report = vi.fn();
    const expected = readFixture('same-line.output.ts');

    const output = migrate('same-line.ts', readFixture('same-line.input.ts'), report);
    const secondRun = migrate('same-line.ts', expected);

    expect(output).toBe(expected);
    expect(secondRun).toBe(expected);
    expect(report).not.toHaveBeenCalled();
  });

  it('reads a Flow-annotated .js file', () => {
    const report = vi.fn();
    const expected = readFixture('flow.output.js');

    const output = migrate('flow.js', readFixture('flow.input.js'), report);
    const secondRun = migrate('flow.js', expected);

    expect(output).toBe(expected);
    expect(secondRun).toBe(expected);
    expect(report).not.toHaveBeenCalled();
  });

  it('reads a sloppy-mode script', () => {
    const report = vi.fn();
    const expected = readFixture('sloppy-script.output.js');

    const output = migrate('sloppy-script.js', readFixture('sloppy-script.input.js'), report);
    const secondRun = migrate('sloppy-script.js', expected);

    expect(output).toBe(expected);
    expect(secondRun).toBe(expected);
    expect(report).not.toHaveBeenCalled();
  });

  it('reads JSX in a .js file', () => {
    const report = vi.fn();
    const expected = readFixture('jsx-in-js.output.js');

    const output = migrate('jsx-in-js.js', readFixture('jsx-in-js.input.js'), report);
    const secondRun = migrate('jsx-in-js.js', expected);

    expect(output).toBe(expected);
    expect(secondRun).toBe(expected);
    expect(report).not.toHaveBeenCalled();
  });
});

describe('mobile-to-root — package.json', () => {
  it('replaces the dependency and raises the react-simplikit floor', () => {
    const report = vi.fn();
    const expected = readFixture('dependencies.output.json');

    const output = migrate('package.json', readFixture('dependencies.input.json'), report);
    const secondRun = migrate('package.json', expected);

    expect(output).toBe(expected);
    expect(secondRun).toBe(expected);
    expect(report).not.toHaveBeenCalled();
  });

  it('writes a >= floor for peerDependencies and reports a workspace: protocol', () => {
    const report = vi.fn();
    const expected = readFixture('workspace-and-peer.output.json');

    const output = migrate('package.json', readFixture('workspace-and-peer.input.json'), report);
    const secondRun = migrate('package.json', expected);

    expect(output).toBe(expected);
    expect(secondRun).toBe(expected);
    expect(report).toHaveBeenCalledTimes(1);
  });

  it('reports resolutions without editing them', () => {
    const report = vi.fn();
    const input = readFixture('resolutions.input.json');

    const output = migrate('package.json', input, report);

    expect(output).toBe(input);
    expect(report).toHaveBeenCalledTimes(1);
  });

  it('skips every other JSON file', () => {
    const source = JSON.stringify({ paths: { '@react-simplikit/mobile': ['./stub'] } });

    const output = migrate('tsconfig.json', source);

    expect(output).toBeUndefined();
  });
});

describe('mobile-to-root — files it must not change', () => {
  it('returns a file without the package byte for byte', () => {
    const report = vi.fn();
    const input = readFixture('no-mobile-import.input.ts');

    const output = migrate('no-mobile-import.ts', input, report);

    expect(output).toBe(input);
    expect(report).not.toHaveBeenCalled();
  });

  it('leaves a moduleNameMapper entry and reports it', () => {
    const report = vi.fn();
    const input = readFixture('module-name-mapper.input.js');

    const output = migrate('jest.config.js', input, report);

    expect(output).toBe(input);
    expect(report).toHaveBeenCalledTimes(1);
  });

  it('leaves the package name in comments and strings and reports it', () => {
    const report = vi.fn();
    const input = readFixture('string-mention.input.ts');

    const output = migrate('string-mention.ts', input, report);

    expect(output).toBe(input);
    expect(report).toHaveBeenCalledTimes(1);
  });

  it('leaves a subpath import and reports it', () => {
    const report = vi.fn();
    const input = readFixture('subpath.input.ts');

    const output = migrate('subpath.ts', input, report);

    expect(output).toBe(input);
    expect(report).toHaveBeenCalledTimes(1);
  });
});

describe('mobile-to-root — files it cannot read', () => {
  it('throws on a name imported twice, so jscodeshift reports the file', () => {
    const report = vi.fn();

    expect(() => migrate('duplicate-binding.ts', readFixture('duplicate-binding.input.ts'), report)).toThrow(
      'already been declared'
    );
    expect(report).not.toHaveBeenCalled();
  });
});
