import type { API } from 'jscodeshift';
// @ts-expect-error - type definitions not available
import { applyTransform } from 'jscodeshift/dist/testUtils';
import { describe, expect, it, vi } from 'vitest';

import transform from '../mobile-to-root.ts';
import { getTestfixtures } from '../utils/getTestfixtures.ts';

function apiWithReport(report: (message: string) => void) {
  return { report } as unknown as API;
}

describe('mobile-to-root', () => {
  const { input, expectedOutput, testName } = getTestfixtures('mobile-to-root', 'tsx');

  it(testName, () => {
    expect(applyTransform(transform, null, { path: 'Sheet.tsx', source: input })).toBe(expectedOutput);
  });

  it('reports an import it leaves on its own line', () => {
    const report = vi.fn();
    const source = [
      `import { useToggle } from 'react-simplikit';`,
      `import { isIOS } from '@react-simplikit/mobile'; // only on mobile`,
      ``,
    ].join('\n');

    transform({ path: 'a.ts', source }, apiWithReport(report));

    expect(report).toHaveBeenCalledWith(expect.stringMatching(/^line 2: .*comment/));
  });

  it('rewrites the dependency fields of a package.json', () => {
    const report = vi.fn();
    const source = JSON.stringify({ dependencies: { '@react-simplikit/mobile': '^0.1.0' } }, null, 2);

    const output = transform({ path: 'apps/web/package.json', source }, apiWithReport(report));

    expect(JSON.parse(output ?? '')).toEqual({ dependencies: { 'react-simplikit': '^0.2.0' } });
    expect(report).not.toHaveBeenCalled();
  });

  it('reports what it leaves in package.json for a manual follow-up', () => {
    const report = vi.fn();
    const source = JSON.stringify({ overrides: { '@react-simplikit/mobile': '0.1.0' } });

    transform({ path: 'package.json', source }, apiWithReport(report));

    expect(report).toHaveBeenCalledWith(expect.stringContaining('"overrides"'));
  });

  it('skips every other JSON file', () => {
    const source = JSON.stringify({ paths: { '@react-simplikit/mobile': ['./stub'] } });

    expect(transform({ path: 'tsconfig.json', source }, apiWithReport(vi.fn()))).toBeUndefined();
  });
});
