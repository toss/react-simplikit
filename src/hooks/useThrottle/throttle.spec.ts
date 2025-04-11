import { describe, expect, it, vi } from 'vitest';

import { throttle } from './throttle.ts';

describe('throttle', () => {
  it('should throttle function calls', async () => {
    const func = vi.fn();
    const throttledFunc = throttle(func, 100);

    throttledFunc();
    throttledFunc();
    throttledFunc();

    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should trigger a trailing call as soon as possible', async () => {
    vi.useFakeTimers();

    const func = vi.fn();
    const throttleMs = 50;

    const throttled = throttle(func, throttleMs);

    throttled();
    throttled();
    expect(func).toBeCalledTimes(1);

    await vi.advanceTimersByTimeAsync(throttleMs + 1);
    expect(func).toBeCalledTimes(2);
  });

  it('should execute the function immediately if not called within the wait time', async () => {
    vi.useFakeTimers();

    const func = vi.fn();
    const throttleMs = 500;
    const throttledFunc = throttle(func, throttleMs);

    throttledFunc(); // should be executed
    expect(func).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(throttleMs / 2);
    expect(func).toHaveBeenCalledTimes(1);

    throttledFunc(); // should be ignored
    expect(func).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(throttleMs / 2 + 1);
    expect(func).toHaveBeenCalledTimes(1);

    throttledFunc(); // should be executed
    expect(func).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(throttleMs / 2 - 1);
    expect(func).toHaveBeenCalledTimes(2);

    throttledFunc(); // should be ignored
    expect(func).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(throttleMs / 2 + 1);
    expect(func).toHaveBeenCalledTimes(2);

    throttledFunc(); // should be executed
    expect(func).toHaveBeenCalledTimes(3);
  });

  it('should call the function with correct arguments', async () => {
    const func = vi.fn();
    const throttleMs = 50;
    const throttledFunc = throttle(func, throttleMs);

    throttledFunc('test', 123);

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith('test', 123);
  });

  it('should not trigger a trailing call when invoked once', async () => {
    const func = vi.fn();
    const throttleMs = 50;

    const throttled = throttle(func, throttleMs);

    throttled();
    expect(func).toBeCalledTimes(1);

    await vi.advanceTimersByTimeAsync(throttleMs + 1);
    expect(func).toBeCalledTimes(1);
  });
});
