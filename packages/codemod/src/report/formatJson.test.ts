import { describe, expect, it } from 'vitest';

import type { RunResult } from '../types.ts';

import { formatJson } from './formatJson.ts';

const result: RunResult = {
  scanned: 3,
  changed: [
    { file: 'src/a.ts', changes: [{ line: 1, kind: 'import' }], dependencies: [] },
    {
      file: 'package.json',
      changes: [],
      dependencies: [{ field: 'dependencies', removed: '@react-simplikit/mobile', added: '^0.2.0' }],
    },
  ],
  manual: [{ file: 'package.json', reason: 'overrides still pins it' }],
};

describe('formatJson', () => {
  it('emits the documented field contract', () => {
    const parsed = JSON.parse(formatJson(result, false)) as Record<string, unknown>;

    expect(Object.keys(parsed).toSorted()).toEqual(['changed', 'dryRun', 'manual', 'scanned', 'transform']);
    expect(parsed.transform).toBe('mobile-to-root');
    expect(parsed.dryRun).toBe(false);
    expect(parsed.scanned).toBe(3);
    expect(parsed.changed).toEqual(result.changed);
    expect(parsed.manual).toEqual(result.manual);
  });

  it('reflects the dry-run flag', () => {
    expect((JSON.parse(formatJson(result, true)) as { dryRun: boolean }).dryRun).toBe(true);
  });

  it('emits valid JSON for a run with no changes', () => {
    expect(() => JSON.parse(formatJson({ scanned: 0, changed: [], manual: [] }, false))).not.toThrow();
  });

  it('omits `added` when nothing was added', () => {
    const output = formatJson(
      {
        scanned: 1,
        changed: [
          {
            file: 'package.json',
            changes: [],
            dependencies: [{ field: 'dependencies', removed: '@react-simplikit/mobile', added: undefined }],
          },
        ],
        manual: [],
      },
      false
    );
    const [dependency] = (JSON.parse(output) as { changed: { dependencies: Record<string, unknown>[] }[] }).changed[0]
      .dependencies;

    // JSON has no `undefined`, so the key disappears. Consumers read a missing key
    // as "the manifest already depended on the root package".
    expect('added' in dependency).toBe(false);
  });
});
