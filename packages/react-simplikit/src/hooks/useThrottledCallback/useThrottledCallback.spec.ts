import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useThrottledCallback } from './useThrottledCallback.ts';

describe('useThrottledCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('is safe on server side rendering', () => {
    const callback = vi.fn();
    renderHookSSR.serverOnly(() => useThrottledCallback({ callback, throttleMs: 100 }));

    expect(callback).not.toHaveBeenCalled();
  });

  it('should throttle the callback with the specified time threshold', () => {
    const callback = vi.fn();
    const { result } = renderHookSSR(() => useThrottledCallback({ callback, throttleMs: 100 }));

    result.current(true);
    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(true);

    result.current(true);
    vi.advanceTimersByTime(50);
    expect(callback).toBeCalledTimes(1);

    // the call inside the window runs on the trailing edge, although it repeats the arguments
    vi.advanceTimersByTime(50);
    expect(callback).toBeCalledTimes(2);
  });

  it('should call on leading edge by default', () => {
    const callback = vi.fn();
    const { result } = renderHookSSR(() => useThrottledCallback({ callback, throttleMs: 100 }));

    result.current(true);
    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(true);
  });

  it('should handle trailing edge', () => {
    const callback = vi.fn();
    const { result } = renderHookSSR(() =>
      useThrottledCallback({ callback, throttleMs: 100, leading: false, trailing: true })
    );

    result.current(true);
    expect(callback).not.toBeCalled();

    vi.advanceTimersByTime(100);
    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(true);
  });

  it('runs the callback again for a call with the same arguments as the last one', () => {
    const callback = vi.fn();
    const { result } = renderHookSSR(() => useThrottledCallback({ callback, throttleMs: 100 }));

    result.current(true);
    vi.advanceTimersByTime(100);
    expect(callback).toBeCalledTimes(1);

    result.current(true);
    vi.advanceTimersByTime(100);
    expect(callback).toBeCalledTimes(2);
  });

  it('should cleanup on unmount', async () => {
    const callback = vi.fn();
    const { result, unmount } = await renderHookSSR(() =>
      useThrottledCallback({ callback, throttleMs: 100, leading: false, trailing: true })
    );

    result.current(true);
    unmount();
    vi.advanceTimersByTime(100);

    expect(callback).not.toBeCalled();
  });

  it('should handle leading and trailing edges together', () => {
    const callback = vi.fn();
    const { result } = renderHookSSR(() =>
      useThrottledCallback({ callback, throttleMs: 100, leading: true, trailing: true })
    );

    result.current(true);
    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(true);

    vi.advanceTimersByTime(100);
    expect(callback).toBeCalledTimes(1);
  });

  it('forwards a number argument to the callback', () => {
    const callback = vi.fn<(value: number) => void>();
    const { result } = renderHookSSR(() => useThrottledCallback({ callback, throttleMs: 100 }));

    result.current(120);

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(120);
  });

  it('should invoke the callback when the first value is false', () => {
    const callback = vi.fn();
    const { result } = renderHookSSR(() => useThrottledCallback({ callback, throttleMs: 100 }));

    result.current(false);

    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(false);
  });

  it('runs the trailing call with the latest arguments when the caller returns to the previous ones', () => {
    const callback = vi.fn();
    const { result } = renderHookSSR(() =>
      useThrottledCallback({ callback, throttleMs: 100, leading: false, trailing: true })
    );

    result.current('seoul');
    vi.advanceTimersByTime(100);

    // 'seo' is scheduled on the trailing edge, then the caller types back to 'seoul' before it fires
    result.current('seo');
    result.current('seoul');
    vi.advanceTimersByTime(100);

    expect(callback.mock.calls).toEqual([['seoul'], ['seoul']]);
  });

  it('should handle value toggling', () => {
    const callback = vi.fn();
    const { result } = renderHookSSR(() => useThrottledCallback({ callback, throttleMs: 100 }));

    result.current(true);
    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(true);

    vi.advanceTimersByTime(100);

    result.current(false);
    expect(callback).toBeCalledTimes(2);
    expect(callback).toBeCalledWith(false);
  });

  it('forwards a stream of distinct values at most once per interval', () => {
    const callback = vi.fn();
    const { result } = renderHookSSR(() => useThrottledCallback({ callback, throttleMs: 100 }));

    for (const value of ['a', 'b', 'c', 'd', 'e']) {
      result.current(value);
      vi.advanceTimersByTime(20);
    }
    expect(callback.mock.calls.map(call => call[0])).toEqual(['a']);

    vi.advanceTimersByTime(100);
    expect(callback.mock.calls.map(call => call[0])).toEqual(['a', 'e']);
  });

  it('keeps forwarding once per interval while values keep changing with trailing edge only', () => {
    const callback = vi.fn();
    const { result } = renderHookSSR(() =>
      useThrottledCallback({ callback, throttleMs: 100, leading: false, trailing: true })
    );

    for (let i = 1; i <= 10; i++) {
      result.current(i);
      vi.advanceTimersByTime(30);
    }
    expect(callback.mock.calls.map(call => call[0])).toEqual([5, 9]);

    vi.advanceTimersByTime(100);
    expect(callback.mock.calls.map(call => call[0])).toEqual([5, 9, 10]);
  });

  it('runs a call repeated after the window on the leading edge of the next one', () => {
    const callback = vi.fn();
    const { result } = renderHookSSR(() => useThrottledCallback({ callback, throttleMs: 100 }));

    result.current(true);
    vi.advanceTimersByTime(200);

    result.current(true);
    vi.advanceTimersByTime(20);
    result.current(false);
    expect(callback.mock.calls.map(call => call[0])).toEqual([true, true]);

    vi.advanceTimersByTime(100);
    expect(callback.mock.calls.map(call => call[0])).toEqual([true, true, false]);
  });

  it('forwards every argument of the latest call on the trailing edge', () => {
    const callback = vi.fn<(x: number, y: number) => void>();
    const { result } = renderHookSSR(() => useThrottledCallback({ callback, throttleMs: 100 }));

    result.current(0, 0);
    result.current(10, 20);
    result.current(30, 40);
    vi.advanceTimersByTime(100);

    expect(callback.mock.calls).toEqual([
      [0, 0],
      [30, 40],
    ]);
  });

  it('throttles a callback that takes no arguments', () => {
    const callback = vi.fn<() => void>();
    const { result } = renderHookSSR(() => useThrottledCallback({ callback, throttleMs: 100 }));

    for (let i = 0; i < 5; i++) {
      result.current();
      vi.advanceTimersByTime(20);
    }
    expect(callback).toBeCalledTimes(1);

    vi.advanceTimersByTime(100);
    expect(callback).toBeCalledTimes(2);
  });

  it('cancels a pending trailing call with cancel', () => {
    const callback = vi.fn();
    const { result } = renderHookSSR(() => useThrottledCallback({ callback, throttleMs: 100 }));

    result.current('leading');
    result.current('trailing');
    result.current.cancel();
    vi.advanceTimersByTime(100);

    expect(callback.mock.calls).toEqual([['leading']]);
  });

  it('runs the latest callback without changing the returned function', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = renderHookSSR(
      ({ callback }) => useThrottledCallback({ callback, throttleMs: 100, leading: false }),
      { initialProps: { callback: first } }
    );
    const throttled = result.current;

    throttled('value');
    rerender({ callback: second });
    vi.advanceTimersByTime(100);

    expect(result.current).toBe(throttled);
    expect(first).not.toBeCalled();
    expect(second).toBeCalledWith('value');
  });

  it('takes the parameter types of the callback', () => {
    const callback = vi.fn<(x: number, y: number) => void>();
    const { result } = renderHookSSR(() => useThrottledCallback({ callback, throttleMs: 100 }));

    // @ts-expect-error the arguments must be numbers
    result.current('0', '0');
    // @ts-expect-error the callback takes two arguments
    result.current(0);
    result.current.cancel();
  });

  it('starts a new window with the next call after cancel', () => {
    const callback = vi.fn();
    const { result } = renderHookSSR(() => useThrottledCallback({ callback, throttleMs: 100 }));

    result.current('a');
    vi.advanceTimersByTime(10);
    result.current('b');
    result.current.cancel();
    vi.advanceTimersByTime(10);
    result.current('c');

    expect(callback.mock.calls).toEqual([['a'], ['c']]);

    vi.advanceTimersByTime(100);
    expect(callback.mock.calls).toEqual([['a'], ['c']]);
  });

  it('drops a pending call and returns a new function when throttleMs changes', () => {
    const callback = vi.fn();
    const { result, rerender } = renderHookSSR(
      ({ throttleMs }) => useThrottledCallback({ callback, throttleMs, leading: false }),
      { initialProps: { throttleMs: 100 } }
    );
    const throttled = result.current;

    throttled('pending');
    rerender({ throttleMs: 200 });
    vi.advanceTimersByTime(300);

    expect(callback).not.toBeCalled();
    expect(result.current).not.toBe(throttled);
  });

  it.each(['leading', 'trailing'] as const)(
    'drops a pending call and returns a new function when %s changes',
    option => {
      const callback = vi.fn();
      const initialProps = { leading: false, trailing: true };
      const { result, rerender } = renderHookSSR(
        ({ leading, trailing }) => useThrottledCallback({ callback, throttleMs: 100, leading, trailing }),
        { initialProps }
      );
      const throttled = result.current;

      throttled('pending');
      rerender({ ...initialProps, [option]: !initialProps[option] });
      vi.advanceTimersByTime(100);

      expect(callback).not.toBeCalled();
      expect(result.current).not.toBe(throttled);
    }
  );

  it('keeps working under StrictMode', () => {
    const callback = vi.fn();
    const { result } = renderHookSSR(() => useThrottledCallback({ callback, throttleMs: 100 }), {
      wrapper: StrictMode,
    });

    result.current('a');
    result.current('b');
    vi.advanceTimersByTime(100);

    expect(callback.mock.calls).toEqual([['a'], ['b']]);
  });
});
