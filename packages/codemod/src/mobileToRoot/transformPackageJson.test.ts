import fc from 'fast-check';
import semver from 'semver';
import { describe, expect, it } from 'vitest';

import { MIN_RUNTIME_VERSION } from '../constants.ts';

import { transformPackageJson } from './transformPackageJson.ts';

const ROOT_RANGE = `^${MIN_RUNTIME_VERSION}`;
const FLOOR_RANGE = `>=${MIN_RUNTIME_VERSION}`;

const [FLOOR_MAJOR] = MIN_RUNTIME_VERSION.split('.').map(Number);
const NEXT_MAJOR = `^${FLOOR_MAJOR + 1}.0.0`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function manifestAfter(input: string): unknown {
  return JSON.parse(transformPackageJson(input).text);
}

function rootRangeAfter(input: string, field = 'dependencies') {
  const manifest = manifestAfter(input);
  const dependencies = isRecord(manifest) ? manifest[field] : undefined;

  return isRecord(dependencies) ? dependencies['react-simplikit'] : undefined;
}

describe('transformPackageJson', () => {
  it('swaps the mobile dependency for the root package', () => {
    const input = `{\n  "dependencies": {\n    "@react-simplikit/mobile": "^0.1.1",\n    "react": "^19.0.0"\n  }\n}\n`;
    const result = transformPackageJson(input);
    const manifest: unknown = JSON.parse(result.text);

    expect(manifest).not.toHaveProperty(['dependencies', '@react-simplikit/mobile']);
    expect(manifest).toMatchObject({ dependencies: { 'react-simplikit': ROOT_RANGE, react: '^19.0.0' } });
    expect(result.changes).toEqual([{ field: 'dependencies', removed: '@react-simplikit/mobile', added: ROOT_RANGE }]);
  });

  it('only removes the old entry when the root package already satisfies the floor', () => {
    const input = `{\n  "dependencies": {\n    "@react-simplikit/mobile": "^0.1.1",\n    "react-simplikit": "^0.2.0"\n  }\n}\n`;
    const result = transformPackageJson(input);

    expect(rootRangeAfter(input)).toBe('^0.2.0');
    expect(result.changes).toEqual([{ field: 'dependencies', removed: '@react-simplikit/mobile', added: null }]);
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

    expect(transformPackageJson(input).changes.map(change => change.added)).toEqual([ROOT_RANGE, ROOT_RANGE]);
    expect(rootRangeAfter(input)).toBe(ROOT_RANGE);
    expect(rootRangeAfter(input, 'devDependencies')).toBe(ROOT_RANGE);
  });

  it('does not leave a field empty because another field already had the root package', () => {
    const input = `{\n  "devDependencies": {\n    "react-simplikit": "^0.2.0"\n  },\n  "dependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    expect(rootRangeAfter(input)).toBe(ROOT_RANGE);
    expect(transformPackageJson(input).changes).toEqual([
      { field: 'dependencies', removed: '@react-simplikit/mobile', added: ROOT_RANGE },
    ]);
  });

  it('keeps a peer contract that declared the old package', () => {
    const input = `{\n  "dependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  },\n  "peerDependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    expect(rootRangeAfter(input, 'peerDependencies')).toBe(FLOOR_RANGE);
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

    expect(rootRangeAfter(input)).toBe(ROOT_RANGE);
  });

  it('leaves an existing range that already satisfies the floor', () => {
    const input = `{\n  "dependencies": {\n    "react-simplikit": "^0.9.0",\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    expect(rootRangeAfter(input)).toBe('^0.9.0');
  });

  it('keeps a non-registry protocol instead of inventing a version range', () => {
    const input = `{\n  "dependencies": {\n    "@react-simplikit/mobile": "workspace:*"\n  }\n}\n`;

    expect(rootRangeAfter(input)).toBe('workspace:*');
    expect(transformPackageJson(input).manual.join(' ')).toContain('workspace:*');
  });

  it('leaves an existing non-registry root range alone', () => {
    const input = `{\n  "dependencies": {\n    "react-simplikit": "workspace:*",\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    expect(rootRangeAfter(input)).toBe('workspace:*');
  });

  it('keeps a range whose major is above the floor even when its minor is lower', () => {
    const input = `{\n  "dependencies": {\n    "react-simplikit": "${NEXT_MAJOR}",\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    expect(rootRangeAfter(input)).toBe(NEXT_MAJOR);
  });

  it('keeps an existing protocol spec that carries a version instead of flattening it to a range', () => {
    const input = `{\n  "dependencies": {\n    "react-simplikit": "workspace:^0.1.1",\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    expect(rootRangeAfter(input)).toBe('workspace:^0.1.1');
    expect(transformPackageJson(input).manual.join(' ')).toContain('workspace:^0.1.1');
  });

  it('reports an existing protocol spec rather than silently leaving the floor unchecked', () => {
    const input = `{\n  "dependencies": {\n    "react-simplikit": "workspace:*",\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    expect(transformPackageJson(input).manual.join(' ')).toContain('workspace:*');
  });

  it('does not read a version out of a file: path that happens to contain digits', () => {
    const input = `{\n  "dependencies": {\n    "@react-simplikit/mobile": "file:../mobile-0.1.1.tgz"\n  }\n}\n`;

    expect(rootRangeAfter(input)).toBe('file:../mobile-0.1.1.tgz');
    expect(transformPackageJson(input).manual.join(' ')).toContain('file:../mobile-0.1.1.tgz');
  });

  it('keeps a range sitting exactly on the floor', () => {
    const input = `{\n  "dependencies": {\n    "react-simplikit": "${ROOT_RANGE}",\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    expect(rootRangeAfter(input)).toBe(ROOT_RANGE);
  });

  it('raises a wildcard range: it admits every version, so a lockfile could keep one below the floor', () => {
    const input = `{\n  "dependencies": {\n    "react-simplikit": "*",\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    expect(rootRangeAfter(input)).toBe(ROOT_RANGE);
  });

  it('widens rather than narrows a peer range', () => {
    const input = `{\n  "peerDependencies": {\n    "@react-simplikit/mobile": ">=0.1.0"\n  }\n}\n`;

    expect(rootRangeAfter(input, 'peerDependencies')).toBe(FLOOR_RANGE);
  });
});

describe('transformPackageJson — the floor holds for any registry range', () => {
  const version = fc.tuple(fc.nat({ max: 3 }), fc.nat({ max: 12 }), fc.nat({ max: 12 })).map(parts => parts.join('.'));
  const range = fc.oneof(
    version,
    version.map(v => `^${v}`),
    version.map(v => `~${v}`),
    version.map(v => `>=${v}`),
    version.map(v => `<${v}`),
    version.map(v => `${v}-beta.1`),
    fc.constantFrom('*', '', 'x', '0.x', '1.x')
  );

  it('leaves a range alone exactly when every version it admits is on or above the floor', () => {
    fc.assert(
      fc.property(range, existing => {
        const input = JSON.stringify({
          dependencies: { 'react-simplikit': existing, '@react-simplikit/mobile': '^0.1.1' },
        });
        const output = rootRangeAfter(input);

        expect(typeof output === 'string' && semver.subset(output, FLOOR_RANGE)).toBe(true);
        expect(output).toBe(semver.subset(existing, FLOOR_RANGE) ? existing : ROOT_RANGE);
      })
    );
  });
});
