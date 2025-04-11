import { describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useThrottle } from './useThrottle.ts';

describe('useThrottle', () => {
  it('is safe on server side rendering', () => {
    const callback = vi.fn();
    const server = renderHookSSR.serverOnly(() => useThrottle(callback, 50));

    server(result => {
      expect(result.error).toBeUndefined();
      expect(callback).not.toHaveBeenCalled();
    });
  });

  it('should call throttle cancel when unmount', async () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    const { result, unmount } = await renderHookSSR(() => useThrottle(callback, 50));

    const cancel = vi.spyOn(result.current, 'cancel');

    unmount();

    expect(cancel).toHaveBeenCalled();

    vi.restoreAllMocks();
  });
});
