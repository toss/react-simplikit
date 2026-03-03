import { describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useThrottle } from './useThrottle.ts';

describe('useThrottle', () => {
  it('is safe on server side rendering', () => {
    const callback = vi.fn();
    renderHookSSR.serverOnly(() => useThrottle(callback, 50));

    expect(callback).not.toHaveBeenCalled();
  });

  it('should call throttle cancel when unmount', async () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    const { result, unmount } = await renderHookSSR(() => useThrottle(callback, 50));

    const cancel = vi.spyOn(result.current, 'cancel');

    unmount();

    expect(cancel).toHaveBeenCalled();

    vi.restoreAllMocks();
  });

  it('should throttle function calls', async () => {
    const callback = vi.fn();
    const { result } = await renderHookSSR(() => useThrottle(callback, 100));

    result.current();
    result.current();
    result.current();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should trigger a trailing call after wait time', async () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    const throttleMs = 50;
    const { result } = await renderHookSSR(() => useThrottle(callback, throttleMs));

    result.current();
    result.current();
    expect(callback).toBeCalledTimes(1);

    await vi.advanceTimersByTimeAsync(throttleMs + 1);
    expect(callback).toBeCalledTimes(2);

    vi.useRealTimers();
  });

  it('should call the function with correct arguments', async () => {
    const callback = vi.fn();
    const throttleMs = 50;
    const { result } = await renderHookSSR(() => useThrottle(callback, throttleMs));

    result.current('test', 123);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('test', 123);
  });

  it('should execute immediately if not called within wait time', async () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    const throttleMs = 500;
    const { result } = await renderHookSSR(() => useThrottle(callback, throttleMs));

    result.current(); // should execute
    expect(callback).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(throttleMs + 1);

    result.current(); // should execute again
    expect(callback).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  it('should execute on leading and trailing when called multiple times with leading and trailing', async () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    const throttleMs = 50;
    const { result } = await renderHookSSR(() => useThrottle(callback, throttleMs, { edges: ['leading', 'trailing'] }));

    result.current();

    await vi.advanceTimersByTimeAsync(throttleMs + 1);

    expect(callback).toHaveBeenCalledTimes(1);

    result.current();

    await vi.advanceTimersByTimeAsync(throttleMs);

    expect(callback).toHaveBeenCalledTimes(2);

    result.current();
    result.current();

    expect(callback).toHaveBeenCalledTimes(3);

    await vi.advanceTimersByTimeAsync(throttleMs);

    expect(callback).toHaveBeenCalledTimes(4);

    vi.useRealTimers();
  });
});
