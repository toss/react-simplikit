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

    const output = migrate('merge.tsx', readFixture('merge.input.tsx'), report);

    expect(output).toBe(readFixture('merge.output.tsx'));
    expect(migrate('merge.tsx', readFixture('merge.output.tsx'))).toBe(readFixture('merge.output.tsx'));
    expect(report).toHaveBeenCalledTimes(1);
  });

  it('appends to a tab-indented import one binding per line', () => {
    const report = vi.fn();

    const output = migrate('tabs.ts', readFixture('tabs.input.ts'), report);

    expect(output).toBe(readFixture('tabs.output.ts'));
    expect(migrate('tabs.ts', readFixture('tabs.output.ts'))).toBe(readFixture('tabs.output.ts'));
    expect(report).not.toHaveBeenCalled();
  });

  it('keeps CRLF line endings', () => {
    const report = vi.fn();

    const output = migrate('crlf.ts', readFixture('crlf.input.ts'), report);

    expect(output).toBe(readFixture('crlf.output.ts'));
    expect(migrate('crlf.ts', readFixture('crlf.output.ts'))).toBe(readFixture('crlf.output.ts'));
    expect(report).not.toHaveBeenCalled();
  });

  it('keeps a byte order mark', () => {
    const report = vi.fn();

    const output = migrate('bom.ts', readFixture('bom.input.ts'), report);

    expect(output).toBe(readFixture('bom.output.ts'));
    expect(migrate('bom.ts', readFixture('bom.output.ts'))).toBe(readFixture('bom.output.ts'));
    expect(report).not.toHaveBeenCalled();
  });

  it('rewrites dynamic imports, require.resolve, import types, template literals and re-exports', () => {
    const report = vi.fn();

    const output = migrate('specifier-forms.ts', readFixture('specifier-forms.input.ts'), report);

    expect(output).toBe(readFixture('specifier-forms.output.ts'));
    expect(migrate('specifier-forms.ts', readFixture('specifier-forms.output.ts'))).toBe(
      readFixture('specifier-forms.output.ts')
    );
    expect(report).not.toHaveBeenCalled();
  });

  it('rewrites vitest mocks and importActual', () => {
    const report = vi.fn();

    const output = migrate('test-mocks.tsx', readFixture('test-mocks.input.tsx'), report);

    expect(output).toBe(readFixture('test-mocks.output.tsx'));
    expect(migrate('test-mocks.tsx', readFixture('test-mocks.output.tsx'))).toBe(readFixture('test-mocks.output.tsx'));
    expect(report).not.toHaveBeenCalled();
  });

  it('rewrites require and jest mocks in a .cjs file', () => {
    const report = vi.fn();

    const output = migrate('commonjs.cjs', readFixture('commonjs.input.cjs'), report);

    expect(output).toBe(readFixture('commonjs.output.cjs'));
    expect(migrate('commonjs.cjs', readFixture('commonjs.output.cjs'))).toBe(readFixture('commonjs.output.cjs'));
    expect(report).not.toHaveBeenCalled();
  });

  it('rewrites an import with a default binding in place in a .mjs file', () => {
    const report = vi.fn();

    const output = migrate('default-import.mjs', readFixture('default-import.input.mjs'), report);

    expect(output).toBe(readFixture('default-import.output.mjs'));
    expect(migrate('default-import.mjs', readFixture('default-import.output.mjs'))).toBe(
      readFixture('default-import.output.mjs')
    );
    expect(report).not.toHaveBeenCalled();
  });

  it('rewrites a declaration file without lifting imports out of declare module', () => {
    const report = vi.fn();

    const output = migrate('declaration-file.d.ts', readFixture('declaration-file.input.d.ts'), report);

    expect(output).toBe(readFixture('declaration-file.output.d.ts'));
    expect(migrate('declaration-file.d.ts', readFixture('declaration-file.output.d.ts'))).toBe(
      readFixture('declaration-file.output.d.ts')
    );
    expect(report).not.toHaveBeenCalled();
  });

  it('rewrites import-equals', () => {
    const report = vi.fn();

    const output = migrate('import-equals.ts', readFixture('import-equals.input.ts'), report);

    expect(output).toBe(readFixture('import-equals.output.ts'));
    expect(migrate('import-equals.ts', readFixture('import-equals.output.ts'))).toBe(
      readFixture('import-equals.output.ts')
    );
    expect(report).not.toHaveBeenCalled();
  });

  it('parses satisfies, decorators and inline type modifiers', () => {
    const report = vi.fn();

    const output = migrate('modern-syntax.tsx', readFixture('modern-syntax.input.tsx'), report);

    expect(output).toBe(readFixture('modern-syntax.output.tsx'));
    expect(migrate('modern-syntax.tsx', readFixture('modern-syntax.output.tsx'))).toBe(
      readFixture('modern-syntax.output.tsx')
    );
    expect(report).not.toHaveBeenCalled();
  });

  it('merges an empty named import and rewrites a side-effect import', () => {
    const report = vi.fn();

    const output = migrate(
      'empty-and-side-effect-imports.ts',
      readFixture('empty-and-side-effect-imports.input.ts'),
      report
    );

    expect(output).toBe(readFixture('empty-and-side-effect-imports.output.ts'));
    expect(migrate('empty-and-side-effect-imports.ts', readFixture('empty-and-side-effect-imports.output.ts'))).toBe(
      readFixture('empty-and-side-effect-imports.output.ts')
    );
    expect(report).not.toHaveBeenCalled();
  });

  it('merges an import that shares its line with other statements', () => {
    const report = vi.fn();

    const output = migrate('same-line.ts', readFixture('same-line.input.ts'), report);

    expect(output).toBe(readFixture('same-line.output.ts'));
    expect(migrate('same-line.ts', readFixture('same-line.output.ts'))).toBe(readFixture('same-line.output.ts'));
    expect(report).not.toHaveBeenCalled();
  });

  it('reads a Flow-annotated .js file', () => {
    const report = vi.fn();

    const output = migrate('flow.js', readFixture('flow.input.js'), report);

    expect(output).toBe(readFixture('flow.output.js'));
    expect(migrate('flow.js', readFixture('flow.output.js'))).toBe(readFixture('flow.output.js'));
    expect(report).not.toHaveBeenCalled();
  });

  it('reads a sloppy-mode script', () => {
    const report = vi.fn();

    const output = migrate('sloppy-script.js', readFixture('sloppy-script.input.js'), report);

    expect(output).toBe(readFixture('sloppy-script.output.js'));
    expect(migrate('sloppy-script.js', readFixture('sloppy-script.output.js'))).toBe(
      readFixture('sloppy-script.output.js')
    );
    expect(report).not.toHaveBeenCalled();
  });

  it('reads JSX in a .js file', () => {
    const report = vi.fn();

    const output = migrate('jsx-in-js.js', readFixture('jsx-in-js.input.js'), report);

    expect(output).toBe(readFixture('jsx-in-js.output.js'));
    expect(migrate('jsx-in-js.js', readFixture('jsx-in-js.output.js'))).toBe(readFixture('jsx-in-js.output.js'));
    expect(report).not.toHaveBeenCalled();
  });
});

describe('mobile-to-root — package.json', () => {
  it('replaces the dependency and raises the react-simplikit floor', () => {
    const report = vi.fn();

    const output = migrate('package.json', readFixture('dependencies.input.json'), report);

    expect(output).toBe(readFixture('dependencies.output.json'));
    expect(migrate('package.json', readFixture('dependencies.output.json'))).toBe(
      readFixture('dependencies.output.json')
    );
    expect(report).not.toHaveBeenCalled();
  });

  it('writes a >= floor for peerDependencies and reports a workspace: protocol', () => {
    const report = vi.fn();

    const output = migrate('package.json', readFixture('workspace-and-peer.input.json'), report);

    expect(output).toBe(readFixture('workspace-and-peer.output.json'));
    expect(migrate('package.json', readFixture('workspace-and-peer.output.json'))).toBe(
      readFixture('workspace-and-peer.output.json')
    );
    expect(report).toHaveBeenCalledTimes(1);
  });

  it('reports resolutions without editing them', () => {
    const report = vi.fn();

    const output = migrate('package.json', readFixture('resolutions.input.json'), report);

    expect(output).toBe(readFixture('resolutions.input.json'));
    expect(report).toHaveBeenCalledTimes(1);
  });

  it('skips every other JSON file', () => {
    const source = JSON.stringify({ paths: { '@react-simplikit/mobile': ['./stub'] } });

    expect(migrate('tsconfig.json', source)).toBeUndefined();
  });
});

describe('mobile-to-root — files it must not change', () => {
  it('returns a file without the package byte for byte', () => {
    const report = vi.fn();

    const output = migrate('no-mobile-import.ts', readFixture('no-mobile-import.input.ts'), report);

    expect(output).toBe(readFixture('no-mobile-import.input.ts'));
    expect(report).not.toHaveBeenCalled();
  });

  it('leaves a moduleNameMapper entry and reports it', () => {
    const report = vi.fn();

    const output = migrate('jest.config.js', readFixture('module-name-mapper.input.js'), report);

    expect(output).toBe(readFixture('module-name-mapper.input.js'));
    expect(report).toHaveBeenCalledTimes(1);
  });

  it('leaves the package name in comments and strings and reports it', () => {
    const report = vi.fn();

    const output = migrate('string-mention.ts', readFixture('string-mention.input.ts'), report);

    expect(output).toBe(readFixture('string-mention.input.ts'));
    expect(report).toHaveBeenCalledTimes(1);
  });

  it('leaves a subpath import and reports it', () => {
    const report = vi.fn();

    const output = migrate('subpath.ts', readFixture('subpath.input.ts'), report);

    expect(output).toBe(readFixture('subpath.input.ts'));
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
