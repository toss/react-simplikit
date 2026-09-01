import { describe, expect, it } from 'vitest';

import { MIN_RUNTIME_VERSION } from '../../constants.ts';

import { transformPackageJson } from './transformPackageJson.ts';

const ROOT_RANGE = `^${MIN_RUNTIME_VERSION}`;

function depsOf(text: string, field = 'dependencies'): Record<string, string> {
  return (JSON.parse(text) as Record<string, Record<string, string>>)[field] ?? {};
}

describe('transformPackageJson', () => {
  it('swaps the mobile dependency for the root package', () => {
    const input = `{\n  "dependencies": {\n    "@react-simplikit/mobile": "^0.1.1",\n    "react": "^19.0.0"\n  }\n}\n`;
    const result = transformPackageJson(input);
    const dependencies = depsOf(result.text);

    expect(dependencies['@react-simplikit/mobile']).toBeUndefined();
    expect(dependencies['react-simplikit']).toBe(ROOT_RANGE);
    expect(dependencies['react']).toBe('^19.0.0');
    expect(result.changes).toEqual([{ field: 'dependencies', removed: '@react-simplikit/mobile', added: ROOT_RANGE }]);
  });

  it('only removes the old entry when the root package already satisfies the floor', () => {
    const input = `{\n  "dependencies": {\n    "@react-simplikit/mobile": "^0.1.1",\n    "react-simplikit": "^0.2.0"\n  }\n}\n`;
    const result = transformPackageJson(input);

    expect(depsOf(result.text)['react-simplikit']).toBe('^0.2.0');
    expect(result.changes).toEqual([{ field: 'dependencies', removed: '@react-simplikit/mobile', added: undefined }]);
  });

  it('handles devDependencies and optionalDependencies with a caret range', () => {
    for (const field of ['devDependencies', 'optionalDependencies']) {
      const input = `{\n  "${field}": {\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

      expect(transformPackageJson(input).changes).toEqual([
        { field, removed: '@react-simplikit/mobile', added: ROOT_RANGE },
      ]);
    }
  });

  it('replaces the dependency in every field that declared it', () => {
    const input = `{\n  "dependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  },\n  "devDependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;
    const result = transformPackageJson(input);

    expect(result.changes.map(change => change.added)).toEqual([ROOT_RANGE, ROOT_RANGE]);
    expect(depsOf(result.text)['react-simplikit']).toBe(ROOT_RANGE);
    expect(depsOf(result.text, 'devDependencies')['react-simplikit']).toBe(ROOT_RANGE);
  });

  it('does not leave a field empty because another field already had the root package', () => {
    const input = `{\n  "devDependencies": {\n    "react-simplikit": "^0.2.0"\n  },\n  "dependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;
    const result = transformPackageJson(input);

    expect(depsOf(result.text)['react-simplikit']).toBe(ROOT_RANGE);
    expect(result.changes).toEqual([{ field: 'dependencies', removed: '@react-simplikit/mobile', added: ROOT_RANGE }]);
  });

  it('keeps a peer contract that declared the old package', () => {
    const input = `{\n  "dependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  },\n  "peerDependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    expect(depsOf(transformPackageJson(input).text, 'peerDependencies')['react-simplikit']).toBe(
      `>=${MIN_RUNTIME_VERSION}`
    );
  });

  it('preserves four-space indentation and the trailing newline', () => {
    const input = `{\n    "dependencies": {\n        "@react-simplikit/mobile": "^0.1.1"\n    }\n}\n`;

    expect(transformPackageJson(input).text).toBe(
      `{\n    "dependencies": {\n        "react-simplikit": "${ROOT_RANGE}"\n    }\n}\n`
    );
  });

  it('preserves the absence of a trailing newline', () => {
    const input = `{\n  "dependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}`;

    expect(transformPackageJson(input).text.endsWith('}')).toBe(true);
  });

  it('falls back to two-space indentation for a single-line manifest', () => {
    const input = `{"dependencies":{"@react-simplikit/mobile":"^0.1.1"}}`;

    expect(transformPackageJson(input).text).toBe(
      `{\n  "dependencies": {\n    "react-simplikit": "${ROOT_RANGE}"\n  }\n}`
    );
  });

  it('reports resolutions and overrides as manual work instead of editing them', () => {
    const input = `{\n  "resolutions": {\n    "@react-simplikit/mobile": "0.1.1"\n  },\n  "overrides": {\n    "@react-simplikit/mobile": "0.1.1"\n  }\n}\n`;
    const result = transformPackageJson(input);

    expect(result.changes).toEqual([]);
    expect(result.manual).toHaveLength(2);
    expect(result.text).toBe(input);
  });

  it('returns the input untouched when the old package is absent', () => {
    const input = `{\n  "dependencies": {\n    "react": "^19.0.0"\n  }\n}\n`;
    const result = transformPackageJson(input);

    expect(result.text).toBe(input);
    expect(result.changes).toEqual([]);
    expect(result.manual).toEqual([]);
  });

  it('ignores dependency fields that are not objects', () => {
    const asString = transformPackageJson(`{\n  "dependencies": "@react-simplikit/mobile"\n}\n`);
    const asNull = transformPackageJson(
      `{\n  "dependencies": null,\n  "devDependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`
    );

    expect(asString.changes).toEqual([]);
    expect(asNull.changes).toEqual([
      { field: 'devDependencies', removed: '@react-simplikit/mobile', added: ROOT_RANGE },
    ]);
  });

  it('throws when the manifest root is not an object', () => {
    expect(() => transformPackageJson(`["@react-simplikit/mobile"]`)).toThrow(/JSON object/);
  });
});

describe('transformPackageJson — ranges it must not get wrong', () => {
  it('raises an existing range that sits below the floor', () => {
    const input = `{\n  "dependencies": {\n    "react-simplikit": "^0.1.0",\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    expect(depsOf(transformPackageJson(input).text)['react-simplikit']).toBe(ROOT_RANGE);
  });

  it('leaves an existing range that already satisfies the floor', () => {
    const input = `{\n  "dependencies": {\n    "react-simplikit": "^0.9.0",\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    expect(depsOf(transformPackageJson(input).text)['react-simplikit']).toBe('^0.9.0');
  });

  it('keeps a non-registry protocol instead of inventing a version range', () => {
    const input = `{\n  "dependencies": {\n    "@react-simplikit/mobile": "workspace:*"\n  }\n}\n`;
    const result = transformPackageJson(input);

    expect(depsOf(result.text)['react-simplikit']).toBe('workspace:*');
    expect(result.manual.join(' ')).toContain('workspace:*');
  });

  it('leaves an existing non-registry root range alone', () => {
    const input = `{\n  "dependencies": {\n    "react-simplikit": "workspace:*",\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    expect(depsOf(transformPackageJson(input).text)['react-simplikit']).toBe('workspace:*');
  });

  it('widens rather than narrows a peer range', () => {
    const input = `{\n  "peerDependencies": {\n    "@react-simplikit/mobile": ">=0.1.0"\n  }\n}\n`;

    expect(depsOf(transformPackageJson(input).text, 'peerDependencies')['react-simplikit']).toBe(
      `>=${MIN_RUNTIME_VERSION}`
    );
  });
});
