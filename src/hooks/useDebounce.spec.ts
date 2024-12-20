import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useDebounce } from './useDebounce.ts';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should debounce the callback with default options', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 100));

    result.current();
    expect(callback).not.toBeCalled();

    vi.advanceTimersByTime(50);
    expect(callback).not.toBeCalled();

    vi.advanceTimersByTime(50);
    expect(callback).toBeCalledTimes(1);
  });

  it('should handle leading edge', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 100, { leading: true }));

    result.current();
    expect(callback).toBeCalledTimes(1);

    result.current();
    vi.advanceTimersByTime(50);
    expect(callback).toBeCalledTimes(1);

    vi.advanceTimersByTime(40);
    expect(callback).toBeCalledTimes(1);

    vi.advanceTimersByTime(10);
    expect(callback).toBeCalledTimes(2);
  });

  it('should handle trailing edge', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 100, { trailing: true }));

    result.current();
    expect(callback).not.toBeCalled();

    vi.advanceTimersByTime(50);
    result.current();
    expect(callback).not.toBeCalled();

    vi.advanceTimersByTime(100);
    expect(callback).toBeCalledTimes(1);
  });

  it('should handle both leading and trailing edges', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 100, { leading: true, trailing: true }));

    result.current();
    expect(callback).toBeCalledTimes(1);

    result.current();
    vi.advanceTimersByTime(150);
    expect(callback).toBeCalledTimes(2);
  });

  it('should cleanup on unmount', () => {
    const callback = vi.fn();
    const { result, unmount } = renderHook(() => useDebounce(callback, 100));

    result.current();
    unmount();
    vi.advanceTimersByTime(100);

    expect(callback).not.toBeCalled();
  });
});
