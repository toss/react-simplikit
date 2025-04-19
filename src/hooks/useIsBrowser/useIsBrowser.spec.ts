import { describe, expect, it } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useIsBrowser } from './useIsBrowser.ts';

describe('useIsBrowser', () => {
  it('returns false on server side rendering', () => {
    const result = renderHookSSR.serverOnly(() => useIsBrowser());

    expect(result.current).toBe(false);
  });

  it('returns true on client side', async () => {
    const { result } = await renderHookSSR(() => useIsBrowser());

    expect(result.current).toBe(true);
  });
}); 