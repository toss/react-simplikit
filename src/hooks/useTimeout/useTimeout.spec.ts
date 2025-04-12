import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useTimeout } from './useTimeout.ts';

describe('useTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('is safe on server side rendering', () => {
    const callback = vi.fn();
    renderHookSSR.serverOnly(() => useTimeout(callback, 1000));

    expect(callback).not.toHaveBeenCalled();
  });

  it('should call callback after specified delay', async () => {
    const callback = vi.fn();
    await renderHookSSR(() => useTimeout(callback, 1000));

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should use 0ms as default delay', async () => {
    const callback = vi.fn();
    await renderHookSSR(() => useTimeout(callback));

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(0);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should clear timeout on unmount', async () => {
    const callback = vi.fn();
    const { unmount } = await renderHookSSR(() => useTimeout(callback, 1000));

    unmount();
    vi.advanceTimersByTime(1000);

    expect(callback).not.toHaveBeenCalled();
  });

  it('should keep the timeout when rerendering happens', async () => {
    const callback = vi.fn();
    const { rerender } = await renderHookSSR(() => useTimeout(callback, 3000));

    vi.advanceTimersByTime(1500);
    rerender();
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1500);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should reset timeout when delay changes', async () => {
    const callback = vi.fn();
    const { rerender } = await renderHookSSR(({ delay }) => useTimeout(callback, delay), {
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

  it('should perform multiple timers independently', async () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    await renderHookSSR(() => {
      useTimeout(callback1, 1000);
      useTimeout(callback2, 2000);
    });

    vi.advanceTimersByTime(1000);
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('should treat negative delay as 0ms', async () => {
    const callback = vi.fn();
    await renderHookSSR(() => useTimeout(callback, -1000));

    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(0);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should treat undefined delay as 0ms', async () => {
    const callback = vi.fn();
    await renderHookSSR(() => useTimeout(callback, undefined));

    vi.advanceTimersByTime(0);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
