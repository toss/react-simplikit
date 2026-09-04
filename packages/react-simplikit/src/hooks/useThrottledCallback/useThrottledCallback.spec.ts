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
    const onChange = vi.fn();
    renderHookSSR.serverOnly(() => useThrottledCallback({ onChange, timeThreshold: 100 }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('should throttle the callback with the specified time threshold', () => {
    const onChange = vi.fn();
    const { result } = renderHookSSR(() => useThrottledCallback({ onChange, timeThreshold: 100 }));

    result.current(true);
    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toBeCalledWith(true);

    result.current(true);
    vi.advanceTimersByTime(50);
    expect(onChange).toBeCalledTimes(1);

    vi.advanceTimersByTime(50);
    expect(onChange).toBeCalledTimes(1);
  });

  it('should call on leading edge by default', () => {
    const onChange = vi.fn();
    const { result } = renderHookSSR(() => useThrottledCallback({ onChange, timeThreshold: 100 }));

    result.current(true);
    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toBeCalledWith(true);
  });

  it('should handle trailing edge', () => {
    const onChange = vi.fn();
    const { result } = renderHookSSR(() => useThrottledCallback({ onChange, timeThreshold: 100, edges: ['trailing'] }));

    result.current(true);
    expect(onChange).not.toBeCalled();

    vi.advanceTimersByTime(100);
    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toBeCalledWith(true);
  });

  it('should not trigger callback if value has not changed', () => {
    const onChange = vi.fn();
    const { result } = renderHookSSR(() => useThrottledCallback({ onChange, timeThreshold: 100 }));

    result.current(true);
    vi.advanceTimersByTime(100);
    expect(onChange).toBeCalledTimes(1);

    result.current(true);
    vi.advanceTimersByTime(100);
    expect(onChange).toBeCalledTimes(1);
  });

  it('should cleanup on unmount', async () => {
    const onChange = vi.fn();
    const { result, unmount } = await renderHookSSR(() =>
      useThrottledCallback({ onChange, timeThreshold: 100, edges: ['trailing'] })
    );

    result.current(true);
    unmount();
    vi.advanceTimersByTime(100);

    expect(onChange).not.toBeCalled();
  });

  it('should handle leading and trailing edges together', () => {
    const onChange = vi.fn();
    const { result } = renderHookSSR(() =>
      useThrottledCallback({ onChange, timeThreshold: 100, edges: ['leading', 'trailing'] })
    );

    result.current(true);
    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toBeCalledWith(true);

    vi.advanceTimersByTime(100);
    expect(onChange).toBeCalledTimes(1);
  });

  it('forwards a number value to onChange', () => {
    const onChange = vi.fn<(value: number) => void>();
    const { result } = renderHookSSR(() => useThrottledCallback({ onChange, timeThreshold: 100 }));

    result.current(120);

    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toBeCalledWith(120);
  });

  it('should invoke the callback when the first value is false', () => {
    const onChange = vi.fn();
    const { result } = renderHookSSR(() => useThrottledCallback({ onChange, timeThreshold: 100 }));

    result.current(false);

    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toBeCalledWith(false);
  });

  it('should still skip a repeated false after the first one', () => {
    const onChange = vi.fn();
    const { result } = renderHookSSR(() => useThrottledCallback({ onChange, timeThreshold: 100 }));

    result.current(false);
    vi.advanceTimersByTime(100);
    expect(onChange).toBeCalledTimes(1);

    result.current(false);
    vi.advanceTimersByTime(100);
    expect(onChange).toBeCalledTimes(1);
  });

  it('discards a pending trailing value when the caller returns to the last forwarded one', () => {
    const onChange = vi.fn();
    const { result } = renderHookSSR(() => useThrottledCallback({ onChange, timeThreshold: 100, edges: ['trailing'] }));

    result.current('seoul');
    vi.advanceTimersByTime(100);
    expect(onChange).toHaveBeenLastCalledWith('seoul');

    // 'seo' is scheduled on the trailing edge, then the caller types back to 'seoul' before it fires
    result.current('seo');
    result.current('seoul');
    vi.advanceTimersByTime(100);

    expect(onChange).toBeCalledTimes(1);
  });

  it('should handle value toggling', () => {
    const onChange = vi.fn();
    const { result } = renderHookSSR(() => useThrottledCallback({ onChange, timeThreshold: 100 }));

    result.current(true);
    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toBeCalledWith(true);

    vi.advanceTimersByTime(100);

    result.current(false);
    expect(onChange).toBeCalledTimes(2);
    expect(onChange).toBeCalledWith(false);
  });

  it('forwards a stream of distinct values at most once per interval', () => {
    const onChange = vi.fn();
    const { result } = renderHookSSR(() => useThrottledCallback({ onChange, timeThreshold: 100 }));

    for (const value of ['a', 'b', 'c', 'd', 'e']) {
      result.current(value);
      vi.advanceTimersByTime(20);
    }
    expect(onChange.mock.calls.map(call => call[0])).toEqual(['a']);

    vi.advanceTimersByTime(100);
    expect(onChange.mock.calls.map(call => call[0])).toEqual(['a', 'e']);
  });

  it('keeps forwarding once per interval while values keep changing with trailing edge only', () => {
    const onChange = vi.fn();
    const { result } = renderHookSSR(() => useThrottledCallback({ onChange, timeThreshold: 100, edges: ['trailing'] }));

    for (let i = 1; i <= 10; i++) {
      result.current(i);
      vi.advanceTimersByTime(30);
    }
    expect(onChange.mock.calls.map(call => call[0])).toEqual([5, 9]);

    vi.advanceTimersByTime(100);
    expect(onChange.mock.calls.map(call => call[0])).toEqual([5, 9, 10]);
  });

  it('lets a value repeated after the window still occupy the next one', () => {
    const onChange = vi.fn();
    const { result } = renderHookSSR(() => useThrottledCallback({ onChange, timeThreshold: 100 }));

    result.current(true);
    expect(onChange.mock.calls.map(call => call[0])).toEqual([true]);

    vi.advanceTimersByTime(200);

    // repeated value: skipped as a duplicate, but the call still opens a throttle window
    result.current(true);
    vi.advanceTimersByTime(20);
    result.current(false);
    expect(onChange.mock.calls.map(call => call[0])).toEqual([true]);

    vi.advanceTimersByTime(100);
    expect(onChange.mock.calls.map(call => call[0])).toEqual([true, false]);
  });
});
