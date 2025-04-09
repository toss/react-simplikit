import { DependencyList, useEffect } from 'react';
import { renderHook } from '@testing-library/react';

import { useCallbackOncePerRender } from './useCallbackOncePerRender.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useCaller(callback: (...args: any) => any, deps: DependencyList) {
  useEffect(() => {
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

describe('useCallbackOncePerRender', () => {
  it('should execute callback only once', () => {
    const mockFn = vitest.fn();
    const { rerender } = renderHook(({ effect }) => useCaller(useCallbackOncePerRender(mockFn, []), [effect]), {
      initialProps: { effect: 0 },
    });

    rerender({ effect: 1 });
    rerender({ effect: 2 });
    rerender({ effect: 3 });

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should reset and execute again when dependencies change', () => {
    const mockFn = vitest.fn();
    const { rerender } = renderHook(
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

  it('should pass arguments to callback', () => {
    const mockFn = vitest.fn();
    const { result } = renderHook(() => useCallbackOncePerRender(mockFn, []));
    result.current('test', 123);
    expect(mockFn).toHaveBeenCalledWith('test', 123);
  });
});
