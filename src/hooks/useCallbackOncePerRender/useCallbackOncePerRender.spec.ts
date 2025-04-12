/* eslint-disable @typescript-eslint/no-explicit-any */
import { DependencyList, useEffect } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useCallbackOncePerRender } from './useCallbackOncePerRender.ts';

function useCaller(callback: (...args: any) => any, deps: DependencyList) {
  useEffect(() => {
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

describe('useCallbackOncePerRender', () => {
  it('is safe on server side rendering', () => {
    const mockFn = vi.fn();
    renderHookSSR.serverOnly(() => useCallbackOncePerRender(mockFn, []));
  });

  it('should execute callback only once', async () => {
    const mockFn = vi.fn();
    const { rerender } = await renderHookSSR(
      ({ effect }) => useCaller(useCallbackOncePerRender(mockFn, []), [effect]),
      {
        initialProps: { effect: 0 },
      }
    );

    rerender({ effect: 1 });
    rerender({ effect: 2 });
    rerender({ effect: 3 });

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should reset and execute again when dependencies change', async () => {
    const mockFn = vi.fn();
    const { rerender } = await renderHookSSR(
      ({ effect, call }) => useCaller(useCallbackOncePerRender(mockFn, [call]), [effect, call]),
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
    const { result } = await renderHookSSR(() => useCallbackOncePerRender(mockFn, []));
    result.current('test', 123);
    expect(mockFn).toHaveBeenCalledWith('test', 123);
  });
});
