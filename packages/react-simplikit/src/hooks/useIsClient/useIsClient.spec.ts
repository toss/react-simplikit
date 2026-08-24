import { describe, expect, it } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useIsClient } from './useIsClient.ts';

describe('useIsClient', () => {
  it('is safe on server side rendering', async () => {
    const result = renderHookSSR.serverOnly(() => useIsClient());

    expect(result.current).toBe(false);
  });

  it('should return true after hydration on the client', async () => {
    const { result } = await renderHookSSR(() => useIsClient());

    expect(result.current).toBe(true);
  });
});
