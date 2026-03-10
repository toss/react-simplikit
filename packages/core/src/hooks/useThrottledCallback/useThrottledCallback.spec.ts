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
});
