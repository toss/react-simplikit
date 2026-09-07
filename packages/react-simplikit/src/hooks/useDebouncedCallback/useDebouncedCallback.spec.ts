import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useDebouncedCallback } from './useDebouncedCallback.ts';

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('is safe on server side rendering', () => {
    const onChange = vi.fn();
    renderHookSSR.serverOnly(() => useDebouncedCallback({ onChange, timeThreshold: 100 }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('should debounce the callback with the specified time threshold', () => {
    const onChange = vi.fn();
    const { result } = renderHookSSR(() => useDebouncedCallback({ onChange, timeThreshold: 100 }));

    result.current(true);
    expect(onChange).not.toBeCalled();

    result.current(true);
    vi.advanceTimersByTime(50);
    expect(onChange).not.toBeCalled();

    // a newer value while the first one is still pending replaces it: only the settled value is forwarded
    result.current(false);
    vi.advanceTimersByTime(50);
    expect(onChange).not.toBeCalled();

    vi.advanceTimersByTime(50);
    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toBeCalledWith(false);

    result.current(true);
    vi.advanceTimersByTime(100);
    expect(onChange).toBeCalledTimes(2);
    expect(onChange).toBeCalledWith(true);
  });

  it('should handle leading edge', () => {
    const onChange = vi.fn();
    const { result } = renderHookSSR(() => useDebouncedCallback({ onChange, timeThreshold: 100, leading: true }));

    result.current(true);
    expect(onChange).toBeCalledTimes(1);

    result.current(true);
    vi.advanceTimersByTime(50);
    expect(onChange).toBeCalledTimes(1);

    result.current(false);
    vi.advanceTimersByTime(50);
    expect(onChange).toBeCalledTimes(1);

    vi.advanceTimersByTime(50);
    expect(onChange).toBeCalledTimes(2);
    expect(onChange).toBeCalledWith(false);
  });

  it('should not trigger callback if value has not changed', () => {
    const onChange = vi.fn();
    const { result } = renderHookSSR(() => useDebouncedCallback({ onChange, timeThreshold: 100 }));

    result.current(true);
    vi.advanceTimersByTime(100);
    expect(onChange).toBeCalledTimes(1);

    result.current(true);
    vi.advanceTimersByTime(100);
    expect(onChange).toBeCalledTimes(1);
  });

  it('forwards a string value to onChange', () => {
    const onChange = vi.fn<(value: string) => void>();
    const { result } = renderHookSSR(() => useDebouncedCallback({ onChange, timeThreshold: 100 }));

    result.current('react');
    vi.advanceTimersByTime(100);

    expect(onChange).toBeCalledWith('react');
  });

  it('invokes the callback when the first value is false', () => {
    const onChange = vi.fn();
    const { result } = renderHookSSR(() => useDebouncedCallback({ onChange, timeThreshold: 100 }));

    result.current(false);
    vi.advanceTimersByTime(100);

    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toBeCalledWith(false);
  });

  it('discards a pending value when the caller returns to the last forwarded one', () => {
    const onChange = vi.fn();
    const { result } = renderHookSSR(() => useDebouncedCallback({ onChange, timeThreshold: 100 }));

    result.current('seoul');
    vi.advanceTimersByTime(100);
    expect(onChange).toHaveBeenLastCalledWith('seoul');

    // 'seo' is scheduled, then the caller types back to 'seoul' before it fires
    result.current('seo');
    result.current('seoul');
    vi.advanceTimersByTime(100);

    expect(onChange).toBeCalledTimes(1);
  });

  it('should cleanup on unmount', async () => {
    const onChange = vi.fn();
    const { result, unmount } = await renderHookSSR(() => useDebouncedCallback({ onChange, timeThreshold: 100 }));

    result.current(true);
    unmount();
    vi.advanceTimersByTime(100);

    expect(onChange).not.toBeCalled();
  });

  it('debounces a stream of distinct values when leading is true', () => {
    const onChange = vi.fn();
    const { result } = renderHookSSR(() => useDebouncedCallback({ onChange, timeThreshold: 100, leading: true }));

    for (const value of ['a', 'b', 'c']) {
      result.current(value);
      vi.advanceTimersByTime(20);
    }
    expect(onChange.mock.calls.map(call => call[0])).toEqual(['a']);

    vi.advanceTimersByTime(100);
    expect(onChange.mock.calls.map(call => call[0])).toEqual(['a', 'c']);
  });

  it('forwards only the first value of a burst when trailing is false', () => {
    const onChange = vi.fn();
    const { result } = renderHookSSR(() =>
      useDebouncedCallback({ onChange, timeThreshold: 100, leading: true, trailing: false })
    );

    for (const value of ['a', 'b', 'c']) {
      result.current(value);
      vi.advanceTimersByTime(20);
    }
    vi.advanceTimersByTime(200);

    expect(onChange.mock.calls.map(call => call[0])).toEqual(['a']);
  });
});
