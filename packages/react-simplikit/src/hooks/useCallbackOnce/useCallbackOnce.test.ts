/* eslint-disable @typescript-eslint/no-explicit-any */
import { DependencyList, useEffect } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useCallbackOnce } from './useCallbackOnce.ts';
import { useCallbackOncePerRender } from './useCallbackOncePerRender.ts';

function useCaller(callback: (...args: any) => any, deps: DependencyList) {
  useEffect(() => {
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

describe('useCallbackOnce', () => {
  it('is safe on server side rendering', () => {
    const mockFn = vi.fn();
    renderHookSSR.serverOnly(() => useCallbackOnce(mockFn, []));
  });

  it('should execute callback only once', async () => {
    const mockFn = vi.fn();
    const { rerender } = await renderHookSSR(({ effect }) => useCaller(useCallbackOnce(mockFn, []), [effect]), {
      initialProps: { effect: 0 },
    });

    rerender({ effect: 1 });
    rerender({ effect: 2 });
    rerender({ effect: 3 });

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should reset and execute again when dependencies change', async () => {
    const mockFn = vi.fn();
    const { rerender } = await renderHookSSR(
      ({ effect, call }) => useCaller(useCallbackOnce(mockFn, [call]), [effect, call]),
      {
        initialProps: { effect: 0, call: 0 },
      }
    );
    rerender({ effect: 1, call: 0 });
    rerender({ effect: 2, call: 0 });
    expect(mockFn).toHaveBeenCalledTimes(1);

    rerender({ effect: 2, call: 1 });
    rerender({ effect: 3, call: 1 });
    rerender({ effect: 4, call: 1 });
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should pass arguments to callback', async () => {
    const mockFn = vi.fn();
    const { result } = await renderHookSSR(() => useCallbackOnce(mockFn, []));
    result.current('test', 123);
    expect(mockFn).toHaveBeenCalledWith('test', 123);
  });

  it('is also exported under the deprecated name useCallbackOncePerRender', () => {
    expect(useCallbackOncePerRender).toBe(useCallbackOnce);
  });
});
