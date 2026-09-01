import { describe, expect, it } from 'vitest';

import { MIN_RUNTIME_VERSION } from './constants.ts';
import { formatHuman } from './formatHuman.ts';
import type { RunResult } from './types.ts';

const result: RunResult = {
  scanned: 3,
  changed: [
    {
      file: 'src/a.ts',
      changes: [
        { line: 1, kind: 'import' },
        { line: 4, kind: 'merge' },
      ],
      dependencies: [],
    },
    {
      file: 'package.json',
      changes: [],
      dependencies: [{ field: 'dependencies', removed: '@react-simplikit/mobile', added: '^0.2.0' }],
    },
  ],
  manual: [{ file: 'package.json', line: undefined, reason: 'overrides still pins it' }],
  failed: [],
};

describe('formatHuman', () => {
  it('names every changed file so the user can review the diff', () => {
    const output = formatHuman(result, false);

    expect(output).toContain('Changed 2 of 3 files');
    expect(output).toContain('src/a.ts');
    expect(output).toContain('import:1');
    expect(output).toContain('merge:4');
    expect(output).toContain('dependencies: -@react-simplikit/mobile +react-simplikit@^0.2.0');
  });

  it('says "would change" in dry-run mode', () => {
    expect(formatHuman(result, true)).toContain('Would change 2 of 3 files');
  });

  it('lists manual follow-ups', () => {
    expect(formatHuman(result, false)).toContain('package.json — overrides still pins it');
  });

  it('closes an applied run by pointing at the install step', () => {
    const output = formatHuman(result, false);

    expect(output).toContain('Imports now resolve from react-simplikit');
    expect(output).toContain(MIN_RUNTIME_VERSION);
  });

  it('does not claim a dry run changed anything', () => {
    const output = formatHuman(result, true);

    expect(output).toContain('Nothing was written');
    expect(output).toContain('Run without --dry-run to apply');
    expect(output).not.toContain('Imports now resolve');
  });

  it('reports a clean run without a version reminder or a file list', () => {
    const output = formatHuman({ scanned: 5, changed: [], manual: [], failed: [] }, false);

    expect(output).toContain('Scanned 5 files');
    expect(output).toContain('No file imports @react-simplikit/mobile');
    expect(output).not.toContain(MIN_RUNTIME_VERSION);
  });

  it('omits the added marker when only the old dependency was removed', () => {
    const output = formatHuman(
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
        failed: [],
      },
      false
    );

    expect(output).toContain('dependencies: -@react-simplikit/mobile');
    expect(output).not.toContain('+react-simplikit@');
  });

  it('omits the follow-up section when there is nothing to follow up on', () => {
    const output = formatHuman({ ...result, manual: [] }, false);

    expect(output).not.toContain('manual follow-up');
  });
});

describe('formatHuman — manual notes without file changes', () => {
  const manualOnly = {
    scanned: 1,
    changed: [],
    manual: [{ file: 'package.json', line: undefined, reason: '"overrides" still pins it' }],
    failed: [],
  };

  it('shows the follow-up instead of claiming nothing was found', () => {
    const output = formatHuman(manualOnly, false);

    expect(output).toContain('package.json — "overrides" still pins it');
    expect(output).not.toContain('Nothing to change');
  });
});

describe('formatHuman — failures', () => {
  it('names the files it could not process alongside the ones it changed', () => {
    const output = formatHuman(
      {
        scanned: 2,
        changed: [{ file: 'src/a.ts', changes: [{ line: 1, kind: 'import' }], dependencies: [] }],
        manual: [],
        failed: [{ file: 'package.json', reason: 'Unexpected end of JSON input' }],
      },
      false
    );

    expect(output).toContain('src/a.ts');
    expect(output).toContain('Could not be processed:');
    expect(output).toContain('package.json: Unexpected end of JSON input');
  });
});

describe('formatHuman — notes that point at a line', () => {
  it('shows the line so the reader can find the import', () => {
    const output = formatHuman(
      {
        scanned: 1,
        changed: [{ file: 'src/a.ts', changes: [{ line: 1, kind: 'import' }], dependencies: [] }],
        manual: [
          { file: 'src/a.ts', line: 3, reason: 'Left on its own line: `isIOS` already refers to something else.' },
        ],
        failed: [],
      },
      false
    );

    expect(output).toContain('src/a.ts:3 — Left on its own line');
  });
});
