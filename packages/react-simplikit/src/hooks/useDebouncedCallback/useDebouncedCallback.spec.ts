import { StrictMode, useState } from 'react';
import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useDebouncedCallback } from './useDebouncedCallback.ts';

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('is safe on server side rendering', () => {
    const callback = vi.fn();
    renderHookSSR.serverOnly(() => useDebouncedCallback({ callback, debounceMs: 100 }));

    expect(callback).not.toHaveBeenCalled();
  });

  it('should debounce the callback with the specified time threshold', () => {
    const callback = vi.fn();
    const { result } = renderHookSSR(() => useDebouncedCallback({ callback, debounceMs: 100 }));

    result.current(true);
    expect(callback).not.toBeCalled();

    result.current(true);
    vi.advanceTimersByTime(50);
    expect(callback).not.toBeCalled();

    // a newer value while the first one is still pending replaces it: only the settled value is forwarded
    result.current(false);
    vi.advanceTimersByTime(50);
    expect(callback).not.toBeCalled();

    vi.advanceTimersByTime(50);
    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(false);

    result.current(true);
    vi.advanceTimersByTime(100);
    expect(callback).toBeCalledTimes(2);
    expect(callback).toBeCalledWith(true);
  });

  it('should handle leading edge', () => {
    const callback = vi.fn();
    const { result } = renderHookSSR(() => useDebouncedCallback({ callback, debounceMs: 100, leading: true }));

    result.current(true);
    expect(callback).toBeCalledTimes(1);

    result.current(true);
    vi.advanceTimersByTime(50);
    expect(callback).toBeCalledTimes(1);

    result.current(false);
    vi.advanceTimersByTime(50);
    expect(callback).toBeCalledTimes(1);

    vi.advanceTimersByTime(50);
    expect(callback).toBeCalledTimes(2);
    expect(callback).toBeCalledWith(false);
  });

  it('runs the callback again for a call with the same arguments as the last one', () => {
    const callback = vi.fn();
    const { result } = renderHookSSR(() => useDebouncedCallback({ callback, debounceMs: 100 }));

    result.current(true);
    vi.advanceTimersByTime(100);
    expect(callback).toBeCalledTimes(1);

    result.current(true);
    vi.advanceTimersByTime(100);
    expect(callback).toBeCalledTimes(2);
  });

  it('forwards a string argument to the callback', () => {
    const callback = vi.fn<(value: string) => void>();
    const { result } = renderHookSSR(() => useDebouncedCallback({ callback, debounceMs: 100 }));

    result.current('react');
    vi.advanceTimersByTime(100);

    expect(callback).toBeCalledWith('react');
  });

  it('invokes the callback when the first value is false', () => {
    const callback = vi.fn();
    const { result } = renderHookSSR(() => useDebouncedCallback({ callback, debounceMs: 100 }));

    result.current(false);
    vi.advanceTimersByTime(100);

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(false);
  });

  it('runs the callback with the latest arguments when the caller returns to the previous ones', () => {
    const callback = vi.fn();
    const { result } = renderHookSSR(() => useDebouncedCallback({ callback, debounceMs: 100 }));

    result.current('seoul');
    vi.advanceTimersByTime(100);

    // 'seo' is scheduled, then the caller types back to 'seoul' before it fires
    result.current('seo');
    result.current('seoul');
    vi.advanceTimersByTime(100);

    expect(callback.mock.calls).toEqual([['seoul'], ['seoul']]);
  });

  it('should cleanup on unmount', async () => {
    const callback = vi.fn();
    const { result, unmount } = await renderHookSSR(() => useDebouncedCallback({ callback, debounceMs: 100 }));

    result.current(true);
    unmount();
    vi.advanceTimersByTime(100);

    expect(callback).not.toBeCalled();
  });

  it('debounces a stream of distinct values when leading is true', () => {
    const callback = vi.fn();
    const { result } = renderHookSSR(() => useDebouncedCallback({ callback, debounceMs: 100, leading: true }));

    for (const value of ['a', 'b', 'c']) {
      result.current(value);
      vi.advanceTimersByTime(20);
    }
    expect(callback.mock.calls.map(call => call[0])).toEqual(['a']);

    vi.advanceTimersByTime(100);
    expect(callback.mock.calls.map(call => call[0])).toEqual(['a', 'c']);
  });

  it('forwards only the first value of a burst when trailing is false', () => {
    const callback = vi.fn();
    const { result } = renderHookSSR(() =>
      useDebouncedCallback({ callback, debounceMs: 100, leading: true, trailing: false })
    );

    for (const value of ['a', 'b', 'c']) {
      result.current(value);
      vi.advanceTimersByTime(20);
    }
    vi.advanceTimersByTime(200);

    expect(callback.mock.calls.map(call => call[0])).toEqual(['a']);
  });

  it('forwards every argument of the last call', () => {
    const callback = vi.fn<(id: number, label: string) => void>();
    const { result } = renderHookSSR(() => useDebouncedCallback({ callback, debounceMs: 100 }));

    result.current(1, 'first');
    result.current(2, 'second');
    vi.advanceTimersByTime(100);

    expect(callback.mock.calls).toEqual([[2, 'second']]);
  });

  it('runs a callback that takes no arguments once per burst', () => {
    const callback = vi.fn<() => void>();
    const { result } = renderHookSSR(() => useDebouncedCallback({ callback, debounceMs: 100 }));

    result.current();
    result.current();
    vi.advanceTimersByTime(100);
    expect(callback).toBeCalledTimes(1);

    result.current();
    vi.advanceTimersByTime(100);
    expect(callback).toBeCalledTimes(2);
  });

  it('cancels a pending call with cancel', () => {
    const callback = vi.fn();
    const { result } = renderHookSSR(() => useDebouncedCallback({ callback, debounceMs: 100 }));

    result.current('pending');
    result.current.cancel();
    vi.advanceTimersByTime(100);
    expect(callback).not.toBeCalled();

    result.current('next');
    vi.advanceTimersByTime(100);
    expect(callback.mock.calls).toEqual([['next']]);
  });

  it('runs the latest callback without changing the returned function', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = renderHookSSR(({ callback }) => useDebouncedCallback({ callback, debounceMs: 100 }), {
      initialProps: { callback: first },
    });
    const debounced = result.current;

    debounced('value');
    rerender({ callback: second });
    vi.advanceTimersByTime(100);

    expect(result.current).toBe(debounced);
    expect(first).not.toBeCalled();
    expect(second).toBeCalledWith('value');
  });

  it('takes the parameter types of the callback', () => {
    const callback = vi.fn<(id: number, label: string) => void>();
    const { result } = renderHookSSR(() => useDebouncedCallback({ callback, debounceMs: 100 }));

    // @ts-expect-error the second argument must be a string
    result.current(1, 2);
    // @ts-expect-error the callback takes two arguments
    result.current(1);
    result.current.cancel();
  });

  it('runs the next call immediately after cancel when leading is true', () => {
    const callback = vi.fn();
    const { result } = renderHookSSR(() => useDebouncedCallback({ callback, debounceMs: 100, leading: true }));

    result.current('a');
    result.current.cancel();
    result.current('b');

    expect(callback.mock.calls).toEqual([['a'], ['b']]);
  });

  it('drops a pending call and returns a new function when debounceMs changes', () => {
    const callback = vi.fn();
    const { result, rerender } = renderHookSSR(({ debounceMs }) => useDebouncedCallback({ callback, debounceMs }), {
      initialProps: { debounceMs: 100 },
    });
    const debounced = result.current;

    debounced('pending');
    rerender({ debounceMs: 200 });
    vi.advanceTimersByTime(300);

    expect(callback).not.toBeCalled();
    expect(result.current).not.toBe(debounced);
  });

  it('drops a pending call and returns a new function when leading or trailing changes', () => {
    const callback = vi.fn();
    const { result, rerender } = renderHookSSR(
      ({ leading }) => useDebouncedCallback({ callback, debounceMs: 100, leading }),
      { initialProps: { leading: false } }
    );
    const debounced = result.current;

    debounced('pending');
    rerender({ leading: true });
    vi.advanceTimersByTime(100);

    expect(callback).not.toBeCalled();
    expect(result.current).not.toBe(debounced);
  });

  it('forwards the updater function of a state setter', () => {
    const { result } = renderHookSSR(() => {
      const [count, setCount] = useState(0);
      const setCountDebounced = useDebouncedCallback({ callback: setCount, debounceMs: 100 });
      return { count, setCountDebounced };
    });

    act(() => {
      result.current.setCountDebounced(prev => prev + 1);
    });
    expect(result.current.count).toBe(0);

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.count).toBe(1);
  });

  it('keeps working under StrictMode', () => {
    const callback = vi.fn();
    const { result } = renderHookSSR(() => useDebouncedCallback({ callback, debounceMs: 100 }), {
      wrapper: StrictMode,
    });

    result.current('value');
    vi.advanceTimersByTime(100);

    expect(callback.mock.calls).toEqual([['value']]);
  });
});
