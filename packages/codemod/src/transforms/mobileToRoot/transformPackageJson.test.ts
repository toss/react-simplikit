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

  it('only removes the old entry when the root package is already a dependency', () => {
    const input = `{\n  "dependencies": {\n    "@react-simplikit/mobile": "^0.1.1",\n    "react-simplikit": "^0.1.0"\n  }\n}\n`;
    const result = transformPackageJson(input);

    expect(depsOf(result.text)['react-simplikit']).toBe('^0.1.0');
    expect(result.changes).toEqual([{ field: 'dependencies', removed: '@react-simplikit/mobile', added: undefined }]);
  });

  it('handles devDependencies, peerDependencies and optionalDependencies', () => {
    for (const field of ['devDependencies', 'peerDependencies', 'optionalDependencies']) {
      const input = `{\n  "${field}": {\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

      expect(transformPackageJson(input).changes).toEqual([
        { field, removed: '@react-simplikit/mobile', added: ROOT_RANGE },
      ]);
    }
  });

  it('adds the root package once when the old one appears in two fields', () => {
    const input = `{\n  "dependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  },\n  "devDependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;
    const result = transformPackageJson(input);

    expect(result.changes.map(change => change.added)).toEqual([ROOT_RANGE, undefined]);
    expect(depsOf(result.text, 'devDependencies')['react-simplikit']).toBeUndefined();
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
    expect(result.manual.map(note => note.reason)).toHaveLength(2);
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
    // A string, and `null` — both are values a hand-edited manifest can end up with.
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
