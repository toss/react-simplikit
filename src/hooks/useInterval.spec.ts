import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useInterval } from './useInterval.ts';

describe('useInterval', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should execute callback at specified intervals', () => {
    const callback = vi.fn();
    renderHook(() => useInterval(callback, 1000));

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should not set interval when delay is null', () => {
    const callback = vi.fn();
    renderHook(() => useInterval(callback, { delay: null }));

    vi.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should not set interval when enabled is false', () => {
    const callback = vi.fn();
    renderHook(() =>
      useInterval(callback, {
        delay: 1000,
        enabled: false,
      })
    );

    vi.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should not set interval when delay is null', () => {
    const callback = vi.fn();
    renderHook(() =>
      useInterval(callback, {
        delay: null,
        enabled: true,
      })
    );

    vi.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should clean up interval on unmount', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useInterval(callback, 1000));

    unmount();
    vi.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should reset interval when delay changes', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(({ delay }) => useInterval(callback, delay), { initialProps: { delay: 1000 } });

    vi.advanceTimersByTime(500);
    rerender({ delay: 2000 });

    vi.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should support numeric delay parameter', () => {
    const callback = vi.fn();
    renderHook(() => useInterval(callback, 1000));

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should support options object parameter', () => {
    const callback = vi.fn();
    renderHook(() =>
      useInterval(callback, {
        delay: 1000,
        enabled: true,
      })
    );

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  describe('trailing option', () => {
    it('should execute callback immediately when trailing is false', () => {
      const callback = vi.fn();
      renderHook(() =>
        useInterval(callback, {
          delay: 1000,
          trailing: false,
        })
      );

      expect(callback).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should wait for first delay when trailing is true', () => {
      const callback = vi.fn();
      renderHook(() =>
        useInterval(callback, {
          delay: 1000,
          trailing: true,
        })
      );

      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle enabled flag changes appropriately', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ enabled }) =>
        useInterval(callback, {
          delay: 1000,
          enabled,
        }),
      { initialProps: { enabled: true } }
    );

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    rerender({ enabled: false });
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    rerender({ enabled: true });
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
