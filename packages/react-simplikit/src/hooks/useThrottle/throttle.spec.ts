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

  it('should invoke once per window while calls keep coming with trailing edge only', () => {
    vi.useFakeTimers();

    const func = vi.fn();
    const throttled = throttle(func, 100, { edges: ['trailing'] });

    for (let i = 1; i <= 10; i++) {
      throttled(i);
      vi.advanceTimersByTime(30);
    }
    expect(func.mock.calls.map(call => call[0])).toEqual([5, 9]);

    vi.advanceTimersByTime(100);
    expect(func.mock.calls.map(call => call[0])).toEqual([5, 9, 10]);

    vi.useRealTimers();
  });

  it('should defer a call after an idle period with trailing edge only', () => {
    vi.useFakeTimers();

    const func = vi.fn();
    const throttled = throttle(func, 100, { edges: ['trailing'] });

    throttled('a');
    expect(func).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(400);
    throttled('b');
    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toHaveBeenLastCalledWith('b');

    vi.useRealTimers();
  });

  it('should invoke once per window while calls keep coming with leading edge only', () => {
    vi.useFakeTimers();

    const func = vi.fn();
    const throttled = throttle(func, 100, { edges: ['leading'] });

    for (let i = 1; i <= 10; i++) {
      throttled(i);
      vi.advanceTimersByTime(30);
    }
    vi.advanceTimersByTime(200);

    expect(func.mock.calls.map(call => call[0])).toEqual([1, 5, 9]);

    vi.useRealTimers();
  });

  it('should forget the pending call on cancel', () => {
    vi.useFakeTimers();

    const func = vi.fn();
    const throttled = throttle(func, 100, { edges: ['trailing'] });

    throttled('a');
    throttled.cancel();
    vi.advanceTimersByTime(500);

    throttled('b');
    expect(func).toHaveBeenCalledTimes(0);

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenLastCalledWith('b');

    vi.useRealTimers();
  });

  it('should never invoke when edges is empty', () => {
    vi.useFakeTimers();

    const func = vi.fn();
    const throttled = throttle(func, 100, { edges: [] });

    throttled('a');
    vi.advanceTimersByTime(100);
    throttled('b');
    vi.advanceTimersByTime(300);

    expect(func).not.toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('should keep deferring calls after an idle period until the reopened window elapses', () => {
    vi.useFakeTimers();

    const func = vi.fn();
    const throttled = throttle(func, 100, { edges: ['trailing'] });

    throttled('a');
    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenLastCalledWith('a');

    vi.advanceTimersByTime(200);
    throttled('b');
    vi.advanceTimersByTime(10);
    throttled('c');
    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toHaveBeenLastCalledWith('c');

    vi.useRealTimers();
  });

  it('should use the actual invocation time, not the call time, as the start of the next window', () => {
    vi.useFakeTimers();

    const func = vi.fn();
    const throttled = throttle(func, 100, { edges: ['trailing'] });

    throttled('a');
    vi.advanceTimersByTime(100); // the debounce timer fires here, invoking with 'a'
    expect(func).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(50); // 50ms after the invocation above
    throttled('b');

    vi.advanceTimersByTime(60); // 110ms after the invocation, so the window has elapsed
    throttled('c');
    expect(func).toHaveBeenCalledTimes(2);
    expect(func).toHaveBeenLastCalledWith('c');

    vi.useRealTimers();
  });

  it('should treat a call exactly throttleMs after the window start as elapsed', () => {
    vi.useFakeTimers();

    const func = vi.fn();
    const throttled = throttle(func, 100, { edges: ['trailing'] });

    throttled('a');
    vi.advanceTimersByTime(50);
    throttled('b');
    vi.advanceTimersByTime(50);
    throttled('c');

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenLastCalledWith('c');

    vi.useRealTimers();
  });
});
