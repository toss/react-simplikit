import fc from 'fast-check';
import semver from 'semver';
import { describe, expect, it } from 'vitest';

import { transformPackageJson } from './transformPackageJson.ts';

// The react-simplikit spec the transform leaves in `field`, so a range test reads as one value.
function rootSpecAfter(input: string, field = 'dependencies'): unknown {
  const manifest: Record<string, Record<string, unknown> | undefined> = JSON.parse(transformPackageJson(input).text);

  return manifest[field]?.['react-simplikit'];
}

describe('transformPackageJson — dependency fields', () => {
  it('swaps the mobile dependency for the root package', () => {
    const input = `{\n  "dependencies": {\n    "@react-simplikit/mobile": "^0.1.1",\n    "react": "^19.0.0"\n  }\n}\n`;

    const result = transformPackageJson(input);

    expect(result.text).toBe(
      `{\n  "dependencies": {\n    "react": "^19.0.0",\n    "react-simplikit": "^0.2.0"\n  }\n}\n`
    );
    expect(result.manual).toEqual([]);
  });

  it('only removes the old entry when the root package already satisfies the floor', () => {
    const input = `{\n  "dependencies": {\n    "@react-simplikit/mobile": "^0.1.1",\n    "react-simplikit": "^0.2.0"\n  }\n}\n`;

    const result = transformPackageJson(input);

    expect(result.text).toBe(`{\n  "dependencies": {\n    "react-simplikit": "^0.2.0"\n  }\n}\n`);
  });

  it('swaps the dependency in devDependencies', () => {
    const input = `{\n  "devDependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    const result = transformPackageJson(input);

    expect(result.text).toBe(`{\n  "devDependencies": {\n    "react-simplikit": "^0.2.0"\n  }\n}\n`);
  });

  it('swaps the dependency in optionalDependencies', () => {
    const input = `{\n  "optionalDependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    const result = transformPackageJson(input);

    expect(result.text).toBe(`{\n  "optionalDependencies": {\n    "react-simplikit": "^0.2.0"\n  }\n}\n`);
  });

  it('swaps the dependency in every field that declared it', () => {
    const input = `{\n  "dependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  },\n  "devDependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    const result = transformPackageJson(input);

    expect(result.text).toBe(
      `{\n  "dependencies": {\n    "react-simplikit": "^0.2.0"\n  },\n  "devDependencies": {\n    "react-simplikit": "^0.2.0"\n  }\n}\n`
    );
  });

  it('adds the root package to the field that had the old one even when another field already has it', () => {
    const input = `{\n  "devDependencies": {\n    "react-simplikit": "^0.2.0"\n  },\n  "dependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    const result = transformPackageJson(input);

    expect(result.text).toBe(
      `{\n  "devDependencies": {\n    "react-simplikit": "^0.2.0"\n  },\n  "dependencies": {\n    "react-simplikit": "^0.2.0"\n  }\n}\n`
    );
  });

  it('writes a >= floor for peerDependencies', () => {
    const input = `{\n  "peerDependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    const result = transformPackageJson(input);

    expect(result.text).toBe(`{\n  "peerDependencies": {\n    "react-simplikit": ">=0.2.0"\n  }\n}\n`);
  });

  it('skips a dependency field that is a string', () => {
    const input = `{\n  "dependencies": "@react-simplikit/mobile"\n}\n`;

    const result = transformPackageJson(input);

    expect(result.text).toBe(`{\n  "dependencies": "@react-simplikit/mobile"\n}\n`);
  });

  it('skips a dependency field that is null and still rewrites the others', () => {
    const input = `{\n  "dependencies": null,\n  "devDependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    const result = transformPackageJson(input);

    expect(result.text).toBe(
      `{\n  "dependencies": null,\n  "devDependencies": {\n    "react-simplikit": "^0.2.0"\n  }\n}\n`
    );
  });
});

describe('transformPackageJson — formatting', () => {
  it('keeps four-space indentation and the trailing newline', () => {
    const input = `{\n    "dependencies": {\n        "@react-simplikit/mobile": "^0.1.1"\n    }\n}\n`;

    const result = transformPackageJson(input);

    expect(result.text).toBe(`{\n    "dependencies": {\n        "react-simplikit": "^0.2.0"\n    }\n}\n`);
  });

  it('keeps the absence of a trailing newline', () => {
    const input = `{\n  "dependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}`;

    const result = transformPackageJson(input);

    expect(result.text).toBe(`{\n  "dependencies": {\n    "react-simplikit": "^0.2.0"\n  }\n}`);
  });

  it('falls back to two-space indentation for a single-line manifest', () => {
    const input = `{"dependencies":{"@react-simplikit/mobile":"^0.1.1"}}`;

    const result = transformPackageJson(input);

    expect(result.text).toBe(`{\n  "dependencies": {\n    "react-simplikit": "^0.2.0"\n  }\n}`);
  });
});

describe('transformPackageJson — a byte order mark', () => {
  it('reads a manifest that starts with a byte order mark and keeps the mark', () => {
    const input = `\uFEFF{\n  "dependencies": {\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    const result = transformPackageJson(input);

    expect(result.text).toBe(`\uFEFF{\n  "dependencies": {\n    "react-simplikit": "^0.2.0"\n  }\n}\n`);
  });
});

describe('transformPackageJson — what it leaves alone', () => {
  it('returns a manifest without the old package untouched', () => {
    const input = `{\n  "dependencies": {\n    "react": "^19.0.0"\n  }\n}\n`;

    const result = transformPackageJson(input);

    expect(result.text).toBe(`{\n  "dependencies": {\n    "react": "^19.0.0"\n  }\n}\n`);
    expect(result.manual).toEqual([]);
  });

  it('reports resolutions and overrides instead of editing them', () => {
    const input = `{\n  "resolutions": {\n    "@react-simplikit/mobile": "0.1.1"\n  },\n  "overrides": {\n    "@react-simplikit/mobile": "0.1.1"\n  }\n}\n`;

    const result = transformPackageJson(input);

    expect(result.text).toBe(input);
    expect(result.manual).toEqual([expect.stringContaining('"resolutions"'), expect.stringContaining('"overrides"')]);
  });

  it('reports a mention outside the dependency fields', () => {
    const input = `{\n  "peerDependenciesMeta": {\n    "@react-simplikit/mobile": { "optional": true }\n  }\n}\n`;

    const result = transformPackageJson(input);

    expect(result.text).toBe(input);
    expect(result.manual).toEqual([expect.stringContaining('outside the dependency fields')]);
  });

  it('throws when the manifest root is not an object', () => {
    const input = `["@react-simplikit/mobile"]`;

    expect(() => transformPackageJson(input)).toThrow('package.json must contain a JSON object at its root');
  });
});

describe('transformPackageJson — the react-simplikit range it writes', () => {
  it('raises an existing range that sits below the floor', () => {
    const input = `{\n  "dependencies": {\n    "react-simplikit": "^0.1.0",\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    expect(rootSpecAfter(input)).toBe('^0.2.0');
  });

  it('keeps an existing range that already satisfies the floor', () => {
    const input = `{\n  "dependencies": {\n    "react-simplikit": "^0.9.0",\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    expect(rootSpecAfter(input)).toBe('^0.9.0');
  });

  it('keeps a range sitting exactly on the floor', () => {
    const input = `{\n  "dependencies": {\n    "react-simplikit": "^0.2.0",\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    expect(rootSpecAfter(input)).toBe('^0.2.0');
  });

  it('keeps a range whose major is above the floor even when its minor is lower', () => {
    const input = `{\n  "dependencies": {\n    "react-simplikit": "^1.0.0",\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    expect(rootSpecAfter(input)).toBe('^1.0.0');
  });

  it('raises a wildcard, because a lockfile could keep a version below the floor under it', () => {
    const input = `{\n  "dependencies": {\n    "react-simplikit": "*",\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    expect(rootSpecAfter(input)).toBe('^0.2.0');
  });

  it('widens a peer range instead of narrowing it', () => {
    const input = `{\n  "peerDependencies": {\n    "@react-simplikit/mobile": ">=0.1.0"\n  }\n}\n`;

    expect(rootSpecAfter(input, 'peerDependencies')).toBe('>=0.2.0');
  });
});

describe('transformPackageJson — specs that are not version ranges', () => {
  it('keeps a workspace: spec from the old package and reports it', () => {
    const input = `{\n  "dependencies": {\n    "@react-simplikit/mobile": "workspace:*"\n  }\n}\n`;

    const result = transformPackageJson(input);

    expect(rootSpecAfter(input)).toBe('workspace:*');
    expect(result.manual).toEqual([expect.stringContaining('workspace:*')]);
  });

  it('keeps a file: path from the old package without reading a version out of it', () => {
    const input = `{\n  "dependencies": {\n    "@react-simplikit/mobile": "file:../mobile-0.1.1.tgz"\n  }\n}\n`;

    const result = transformPackageJson(input);

    expect(rootSpecAfter(input)).toBe('file:../mobile-0.1.1.tgz');
    expect(result.manual).toEqual([expect.stringContaining('file:../mobile-0.1.1.tgz')]);
  });

  it('keeps an existing workspace: root spec and reports that the floor is unchecked', () => {
    const input = `{\n  "dependencies": {\n    "react-simplikit": "workspace:*",\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    const result = transformPackageJson(input);

    expect(rootSpecAfter(input)).toBe('workspace:*');
    expect(result.manual).toEqual([expect.stringContaining('workspace:*')]);
  });

  it('keeps an existing protocol spec that carries a version instead of flattening it', () => {
    const input = `{\n  "dependencies": {\n    "react-simplikit": "workspace:^0.1.1",\n    "@react-simplikit/mobile": "^0.1.1"\n  }\n}\n`;

    const result = transformPackageJson(input);

    expect(rootSpecAfter(input)).toBe('workspace:^0.1.1');
    expect(result.manual).toEqual([expect.stringContaining('workspace:^0.1.1')]);
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

  // A property test needs an oracle: semver, not the transform, decides what the right answer is.
  it('leaves a range alone exactly when every version it admits is on or above the floor', () => {
    fc.assert(
      fc.property(range, existing => {
        const input = JSON.stringify({
          dependencies: { 'react-simplikit': existing, '@react-simplikit/mobile': '^0.1.1' },
        });

        const output = rootSpecAfter(input);

        expect(output).toBe(semver.subset(existing, '>=0.2.0') ? existing : '^0.2.0');
      })
    );
  });

  it('always writes a range that clears the floor', () => {
    fc.assert(
      fc.property(range, existing => {
        const input = JSON.stringify({
          dependencies: { 'react-simplikit': existing, '@react-simplikit/mobile': '^0.1.1' },
        });

        const output = rootSpecAfter(input);

        expect(semver.subset(String(output), '>=0.2.0')).toBe(true);
      })
    );
  });
});
