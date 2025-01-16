import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useTimeout } from './useTimeout.ts';

describe('useTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call callback after specified delay', () => {
    const callback = vi.fn();
    renderHook(() => useTimeout(callback, 1000));

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should use 0ms as default delay', () => {
    const callback = vi.fn();
    renderHook(() => useTimeout(callback));

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(0);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should clear timeout on unmount', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useTimeout(callback, 1000));

    unmount();
    vi.advanceTimersByTime(1000);

    expect(callback).not.toHaveBeenCalled();
  });

  it('should keep the timeout when rerendering happens', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(() => useTimeout(callback, 3000));

    vi.advanceTimersByTime(1500);
    rerender();
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1500);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should reset timeout when delay changes', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(({ delay }) => useTimeout(callback, delay), {
      initialProps: { delay: 1000 },
    });

    vi.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();

    rerender({ delay: 2000 });
    vi.advanceTimersByTime(1500);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should perform multiple timers independently', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    renderHook(() => {
      useTimeout(callback1, 1000);
      useTimeout(callback2, 2000);
    });

    vi.advanceTimersByTime(1000);
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('should treat negative delay as 0ms', () => {
    const callback = vi.fn();
    renderHook(() => useTimeout(callback, -1000));

    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(0);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should treat undefined delay as 0ms', () => {
    const callback = vi.fn();
    renderHook(() => useTimeout(callback, undefined));

    vi.advanceTimersByTime(0);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
