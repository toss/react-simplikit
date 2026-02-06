import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useScrollDirection } from './useScrollDirection.ts';

describe('useScrollDirection', () => {
  beforeEach(() => {
    vi.useFakeTimers();

    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should return initial state with null direction', () => {
    const { result } = renderHook(() => useScrollDirection());

    expect(result.current).toEqual({
      direction: null,
      position: 0,
    });
  });

  it('should detect scroll down', async () => {
    const { result } = renderHook(() => useScrollDirection());

    await act(async () => {
      Object.defineProperty(window, 'scrollY', { value: 100 });
      window.dispatchEvent(new Event('scroll'));
      vi.runAllTimers();
    });

    expect(result.current).toEqual({
      direction: 'down',
      position: 100,
    });
  });

  it('should detect scroll up', async () => {
    Object.defineProperty(window, 'scrollY', { value: 200 });
    const { result } = renderHook(() => useScrollDirection());

    await act(async () => {
      Object.defineProperty(window, 'scrollY', { value: 100 });
      window.dispatchEvent(new Event('scroll'));
      vi.runAllTimers();
    });

    expect(result.current).toEqual({
      direction: 'up',
      position: 100,
    });
  });

  it('should not update when scroll position is the same', async () => {
    const { result } = renderHook(() => useScrollDirection());

    await act(async () => {
      Object.defineProperty(window, 'scrollY', { value: 0 });
      window.dispatchEvent(new Event('scroll'));
      vi.runAllTimers();
    });

    // Direction should remain null as position hasn't changed
    expect(result.current).toEqual({
      direction: null,
      position: 0,
    });
  });

  it('should throttle scroll events (default 50ms)', async () => {
    const { result } = renderHook(() => useScrollDirection());

    // First scroll - should update
    await act(async () => {
      Object.defineProperty(window, 'scrollY', { value: 50 });
      window.dispatchEvent(new Event('scroll'));
      vi.runAllTimers();
    });

    expect(result.current.position).toBe(50);

    // Second scroll immediately - should be throttled
    Object.defineProperty(window, 'scrollY', { value: 100 });
    window.dispatchEvent(new Event('scroll'));
    // Don't advance timers yet - should still be throttled

    // Should still show previous position (throttled)
    expect(result.current.position).toBe(50);

    // Advance past throttle period and trigger new scroll
    await act(async () => {
      vi.advanceTimersByTime(50);
      Object.defineProperty(window, 'scrollY', { value: 150 });
      window.dispatchEvent(new Event('scroll'));
      vi.runAllTimers();
    });

    expect(result.current.position).toBe(150);
  });

  it('should respect custom throttle time', async () => {
    const { result } = renderHook(() => useScrollDirection({ throttleMs: 100 }));

    await act(async () => {
      Object.defineProperty(window, 'scrollY', { value: 50 });
      window.dispatchEvent(new Event('scroll'));
      vi.runAllTimers();
    });

    expect(result.current.position).toBe(50);

    // Try to scroll immediately - should be throttled
    Object.defineProperty(window, 'scrollY', { value: 100 });
    window.dispatchEvent(new Event('scroll'));
    // Advance only 50ms - should still be throttled
    vi.advanceTimersByTime(50);

    expect(result.current.position).toBe(50);

    // Advance past throttle period
    await act(async () => {
      vi.advanceTimersByTime(50); // Total 100ms
      Object.defineProperty(window, 'scrollY', { value: 150 });
      window.dispatchEvent(new Event('scroll'));
      vi.runAllTimers();
    });

    expect(result.current.position).toBe(150);
  });

  it('should handle throttle time of 0', async () => {
    const { result } = renderHook(() => useScrollDirection({ throttleMs: 0 }));

    await act(async () => {
      Object.defineProperty(window, 'scrollY', { value: 50 });
      window.dispatchEvent(new Event('scroll'));
      vi.runAllTimers();
    });

    expect(result.current.position).toBe(50);

    await act(async () => {
      // With 0ms throttle, should update immediately
      Object.defineProperty(window, 'scrollY', { value: 100 });
      window.dispatchEvent(new Event('scroll'));
      vi.runAllTimers();
    });

    expect(result.current.position).toBe(100);
  });

  it('should remove event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useScrollDirection());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('should clear throttle timer on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const { unmount } = renderHook(() => useScrollDirection());

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 100 });
      window.dispatchEvent(new Event('scroll'));
      // Don't run timers - timer should be pending
    });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('should handle rapid scroll events correctly', async () => {
    const { result } = renderHook(() => useScrollDirection());

    await act(async () => {
      // Rapid scrolls
      Object.defineProperty(window, 'scrollY', { value: 10 });
      window.dispatchEvent(new Event('scroll'));
      vi.runAllTimers();
    });

    expect(result.current.position).toBe(10);

    // Try immediate scroll - should be throttled
    Object.defineProperty(window, 'scrollY', { value: 20 });
    window.dispatchEvent(new Event('scroll'));

    // Should still show previous position (throttled)
    expect(result.current.position).toBe(10);

    // Wait for throttle period
    await act(async () => {
      vi.advanceTimersByTime(50);
      Object.defineProperty(window, 'scrollY', { value: 30 });
      window.dispatchEvent(new Event('scroll'));
      vi.runAllTimers();
    });

    expect(result.current.position).toBe(30);
    expect(result.current.direction).toBe('down');
  });

  it('should handle scroll direction changes', async () => {
    Object.defineProperty(window, 'scrollY', { value: 100 });
    const { result } = renderHook(() => useScrollDirection());

    // Scroll down
    await act(async () => {
      Object.defineProperty(window, 'scrollY', { value: 200 });
      window.dispatchEvent(new Event('scroll'));
      vi.runAllTimers();
    });

    expect(result.current.direction).toBe('down');

    await act(async () => {
      vi.advanceTimersByTime(50);
      // Scroll up
      Object.defineProperty(window, 'scrollY', { value: 150 });
      window.dispatchEvent(new Event('scroll'));
      vi.runAllTimers();
    });

    expect(result.current.direction).toBe('up');

    await act(async () => {
      vi.advanceTimersByTime(50);
      // Scroll down again
      Object.defineProperty(window, 'scrollY', { value: 250 });
      window.dispatchEvent(new Event('scroll'));
      vi.runAllTimers();
    });

    expect(result.current.direction).toBe('down');
  });

  it('should handle scroll to top (position 0)', async () => {
    Object.defineProperty(window, 'scrollY', { value: 500 });
    const { result } = renderHook(() => useScrollDirection());

    await act(async () => {
      Object.defineProperty(window, 'scrollY', { value: 0 });
      window.dispatchEvent(new Event('scroll'));
      vi.runAllTimers();
    });

    expect(result.current).toEqual({
      direction: 'up',
      position: 0,
    });
  });

  it('should handle large scroll distances', async () => {
    const { result } = renderHook(() => useScrollDirection());

    await act(async () => {
      Object.defineProperty(window, 'scrollY', { value: 10000 });
      window.dispatchEvent(new Event('scroll'));
      vi.runAllTimers();
    });

    expect(result.current).toEqual({
      direction: 'down',
      position: 10000,
    });
  });

  it('should use passive event listener', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    renderHook(() => useScrollDirection());

    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), {
      passive: true,
    });
  });

  it('should handle options update', async () => {
    const { result, rerender } = renderHook<ReturnType<typeof useScrollDirection>, { throttleMs: number }>(
      ({ throttleMs }) => useScrollDirection({ throttleMs }),
      {
        initialProps: { throttleMs: 50 },
      }
    );

    await act(async () => {
      Object.defineProperty(window, 'scrollY', { value: 100 });
      window.dispatchEvent(new Event('scroll'));
      vi.runAllTimers();
    });

    expect(result.current.position).toBe(100);

    // Update throttle time
    await act(async () => {
      vi.advanceTimersByTime(50); // Clear previous throttle
      rerender({ throttleMs: 200 });
    });

    // New scroll with updated throttle
    await act(async () => {
      Object.defineProperty(window, 'scrollY', { value: 200 });
      window.dispatchEvent(new Event('scroll'));
      vi.runAllTimers();
    });

    expect(result.current.position).toBe(200);

    // Try immediate scroll - should be throttled with new 200ms value
    Object.defineProperty(window, 'scrollY', { value: 250 });
    window.dispatchEvent(new Event('scroll'));
    vi.advanceTimersByTime(150); // Only 150ms - still throttled

    expect(result.current.position).toBe(200);

    // Wait full throttle period
    await act(async () => {
      vi.advanceTimersByTime(50); // Total 200ms
      Object.defineProperty(window, 'scrollY', { value: 300 });
      window.dispatchEvent(new Event('scroll'));
      vi.runAllTimers();
    });

    expect(result.current.position).toBe(300);
  });

  it('should handle edge case with negative scroll (should not happen in practice)', async () => {
    // Start with positive scroll
    Object.defineProperty(window, 'scrollY', { value: 100 });
    const { result } = renderHook(() => useScrollDirection());

    await act(async () => {
      // Simulating invalid/edge case scenario - scroll to negative
      Object.defineProperty(window, 'scrollY', { value: -100 });
      window.dispatchEvent(new Event('scroll'));
      vi.runAllTimers();
    });

    // -100 < 100, so direction should be 'up'
    expect(result.current.direction).toBe('up');
    expect(result.current.position).toBe(-100);
  });
});
