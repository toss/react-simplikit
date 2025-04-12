import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useInterval } from './useInterval.ts';

describe('useInterval', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should execute callback at specified intervals', async () => {
    const callback = vi.fn();
    await renderHookSSR(() => useInterval(callback, 1000));

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('is safe on server side rendering', () => {
    const callback = vi.fn();
    renderHookSSR.serverOnly(() => useInterval(callback, 1000));

    expect(callback).not.toHaveBeenCalled();
  });

  it('should not set interval when enabled is false', async () => {
    const callback = vi.fn();
    await renderHookSSR(() =>
      useInterval(callback, {
        delay: 1000,
        enabled: false,
      })
    );

    vi.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should clean up interval on unmount', async () => {
    const callback = vi.fn();
    const { unmount } = await renderHookSSR(() => useInterval(callback, 1000));

    unmount();
    vi.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should reset interval when delay changes', async () => {
    const callback = vi.fn();
    const { rerender } = await renderHookSSR(({ delay }) => useInterval(callback, delay), {
      initialProps: { delay: 1000 },
    });

    vi.advanceTimersByTime(500);
    rerender({ delay: 2000 });

    vi.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should support numeric delay parameter', async () => {
    const callback = vi.fn();
    await renderHookSSR(() => useInterval(callback, 1000));

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should support options object parameter', async () => {
    const callback = vi.fn();
    await renderHookSSR(() =>
      useInterval(callback, {
        delay: 1000,
        enabled: true,
      })
    );

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  describe('trailing option', () => {
    it('should execute callback immediately when trailing is false', async () => {
      const callback = vi.fn();
      await renderHookSSR(() =>
        useInterval(callback, {
          delay: 1000,
          immediate: true,
        })
      );

      expect(callback).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should wait for first delay when trailing is true', async () => {
      const callback = vi.fn();
      await renderHookSSR(() =>
        useInterval(callback, {
          delay: 1000,
          immediate: false,
        })
      );

      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1000);
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle enabled flag changes appropriately', async () => {
    const callback = vi.fn();
    const { rerender } = await renderHookSSR(
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
