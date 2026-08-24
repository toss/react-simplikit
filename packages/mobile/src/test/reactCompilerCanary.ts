import { describe, expect, it } from 'vitest';

import { useNetworkStatus } from '../hooks/useNetworkStatus/useNetworkStatus.ts';

// `$[n]` is the React Compiler's memo-cache slot access. Unlike the `_c` import binding,
// which Vitest's SSR module transform renames, it survives into Function.prototype.toString().
const MEMO_CACHE_ACCESS = /\$\[\d+\]/;

// Guards the compiled suite against silently degrading into a duplicate of the uncompiled
// run (e.g. the plugin filter no longer matching source files). Only the compiled config
// includes this file — under the base config, the assertion would not hold.
describe('react compiler canary', () => {
  it('runs against compiled source', () => {
    expect(useNetworkStatus.toString()).toMatch(MEMO_CACHE_ACCESS);
  });
});
