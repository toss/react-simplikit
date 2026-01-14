import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { subscribeKeyboardHeight } from './subscribeKeyboardHeight.ts';

describe('subscribeKeyboardHeight', () => {
  let mockVisualViewport: {
    height: number;
    offsetTop: number;
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.useFakeTimers();

    mockVisualViewport = {
      height: 500,
      offsetTop: 0,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(800);

    Object.defineProperty(window, 'visualViewport', {
      value: mockVisualViewport,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should return an object with unsubscribe function when visualViewport is not available', () => {
    Object.defineProperty(window, 'visualViewport', {
      value: null,
      writable: true,
      configurable: true,
    });

    const callback = vi.fn();
    const { unsubscribe } = subscribeKeyboardHeight({ callback });

    expect(typeof unsubscribe).toBe('function');
    unsubscribe(); // should not throw
  });

  it('should add resize and scroll event listeners', () => {
    const callback = vi.fn();

    subscribeKeyboardHeight({ callback });

    expect(mockVisualViewport.addEventListener).toHaveBeenCalledTimes(2);
    expect(mockVisualViewport.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(mockVisualViewport.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('should call callback with keyboard height on resize event', () => {
    const callback = vi.fn();

    subscribeKeyboardHeight({ callback, throttleMs: 0 });

    const resizeHandler = mockVisualViewport.addEventListener.mock.calls.find(call => call[0] === 'resize')?.[1];

    resizeHandler?.();

    expect(callback).toHaveBeenCalledWith(300);
  });

  it('should call callback with keyboard height on scroll event', () => {
    const callback = vi.fn();

    // Use immediate to set lastHeight, then change height for scroll test
    subscribeKeyboardHeight({ callback, immediate: true, throttleMs: 0 });
    vi.runAllTimers();

    // Reset callback tracking
    callback.mockClear();

    // Change keyboard height
    mockVisualViewport.height = 400;

    const scrollHandler = mockVisualViewport.addEventListener.mock.calls.find(call => call[0] === 'scroll')?.[1];

    scrollHandler?.();

    expect(callback).toHaveBeenCalledWith(400);
  });

  it('should not call callback immediately by default', () => {
    const callback = vi.fn();

    subscribeKeyboardHeight({ callback });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should call callback immediately when immediate option is true', () => {
    const callback = vi.fn();

    subscribeKeyboardHeight({ callback, immediate: true });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(300);
  });

  it('should remove event listeners when unsubscribe is called', () => {
    const callback = vi.fn();

    const { unsubscribe } = subscribeKeyboardHeight({ callback });
    unsubscribe();

    expect(mockVisualViewport.removeEventListener).toHaveBeenCalledTimes(2);
    expect(mockVisualViewport.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(mockVisualViewport.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('should remove the same handler that was added', () => {
    const callback = vi.fn();

    const { unsubscribe } = subscribeKeyboardHeight({ callback });
    unsubscribe();

    const addedResizeHandler = mockVisualViewport.addEventListener.mock.calls.find(call => call[0] === 'resize')?.[1];
    const removedResizeHandler = mockVisualViewport.removeEventListener.mock.calls.find(
      call => call[0] === 'resize'
    )?.[1];

    expect(addedResizeHandler).toBe(removedResizeHandler);
  });

  describe('throttle behavior', () => {
    it('should throttle events by default (16ms)', () => {
      const callback = vi.fn();

      subscribeKeyboardHeight({ callback });

      const resizeHandler = mockVisualViewport.addEventListener.mock.calls.find(call => call[0] === 'resize')?.[1];

      // First call - should invoke callback
      resizeHandler?.();
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(300);

      // Change height and call again immediately - should be throttled
      mockVisualViewport.height = 400;
      resizeHandler?.();
      expect(callback).toHaveBeenCalledTimes(1);

      // Wait for throttle to clear
      vi.advanceTimersByTime(16);

      // Now should invoke callback
      resizeHandler?.();
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenLastCalledWith(400);
    });

    it('should respect custom throttle time', () => {
      const callback = vi.fn();

      subscribeKeyboardHeight({ callback, throttleMs: 100 });

      const resizeHandler = mockVisualViewport.addEventListener.mock.calls.find(call => call[0] === 'resize')?.[1];

      // First call
      resizeHandler?.();
      expect(callback).toHaveBeenCalledTimes(1);

      // Change height
      mockVisualViewport.height = 400;

      // Wait 50ms - should still be throttled
      vi.advanceTimersByTime(50);
      resizeHandler?.();
      expect(callback).toHaveBeenCalledTimes(1);

      // Wait another 50ms (total 100ms)
      vi.advanceTimersByTime(50);
      resizeHandler?.();
      expect(callback).toHaveBeenCalledTimes(2);
    });

    it('should handle throttleMs of 0 (no throttling)', () => {
      const callback = vi.fn();

      subscribeKeyboardHeight({ callback, throttleMs: 0 });

      const resizeHandler = mockVisualViewport.addEventListener.mock.calls.find(call => call[0] === 'resize')?.[1];

      // First call
      resizeHandler?.();
      expect(callback).toHaveBeenCalledTimes(1);

      // Change height and call immediately - should work with 0ms throttle
      mockVisualViewport.height = 400;
      vi.advanceTimersByTime(0);
      resizeHandler?.();
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  describe('deduplication behavior', () => {
    it('should skip callback when height has not changed', () => {
      const callback = vi.fn();

      subscribeKeyboardHeight({ callback, throttleMs: 0 });

      const resizeHandler = mockVisualViewport.addEventListener.mock.calls.find(call => call[0] === 'resize')?.[1];
      const scrollHandler = mockVisualViewport.addEventListener.mock.calls.find(call => call[0] === 'scroll')?.[1];

      // First resize call
      resizeHandler?.();
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(300);

      // Scroll call with same height - should be skipped
      scrollHandler?.();
      expect(callback).toHaveBeenCalledTimes(1);

      // Another resize with same height - should be skipped
      resizeHandler?.();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should call callback when height changes after deduplication', () => {
      const callback = vi.fn();

      subscribeKeyboardHeight({ callback, throttleMs: 0 });

      const resizeHandler = mockVisualViewport.addEventListener.mock.calls.find(call => call[0] === 'resize')?.[1];

      // First call
      resizeHandler?.();
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(300);

      // Same height - skipped
      vi.advanceTimersByTime(0);
      resizeHandler?.();
      expect(callback).toHaveBeenCalledTimes(1);

      // Change height
      mockVisualViewport.height = 600;
      vi.advanceTimersByTime(0);
      resizeHandler?.();
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenLastCalledWith(200);
    });

    it('should handle resize and scroll firing simultaneously with same value', () => {
      const callback = vi.fn();

      subscribeKeyboardHeight({ callback, throttleMs: 0 });

      const resizeHandler = mockVisualViewport.addEventListener.mock.calls.find(call => call[0] === 'resize')?.[1];
      const scrollHandler = mockVisualViewport.addEventListener.mock.calls.find(call => call[0] === 'scroll')?.[1];

      // Simulate simultaneous resize and scroll events
      resizeHandler?.();
      scrollHandler?.();

      // Only one callback should have been invoked due to deduplication
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(300);
    });
  });

  describe('rapid event firing', () => {
    it('should handle rapid events correctly with throttling', () => {
      const callback = vi.fn();

      subscribeKeyboardHeight({ callback, throttleMs: 16 });

      const resizeHandler = mockVisualViewport.addEventListener.mock.calls.find(call => call[0] === 'resize')?.[1];

      // Simulate rapid events (100 events)
      for (let i = 0; i < 100; i++) {
        resizeHandler?.();
      }

      // Should only call once due to throttling and same value
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should limit callbacks during rapid height changes', () => {
      const callback = vi.fn();

      subscribeKeyboardHeight({ callback, throttleMs: 50 });

      const resizeHandler = mockVisualViewport.addEventListener.mock.calls.find(call => call[0] === 'resize')?.[1];

      // First event
      resizeHandler?.();
      expect(callback).toHaveBeenCalledTimes(1);

      // Simulate rapid events with changing heights
      for (let i = 0; i < 100; i++) {
        mockVisualViewport.height = 500 - i;
        resizeHandler?.();
      }

      // Should still be 1 due to throttling
      expect(callback).toHaveBeenCalledTimes(1);

      // Wait for throttle to clear
      vi.advanceTimersByTime(50);

      // Now trigger another event
      mockVisualViewport.height = 200;
      resizeHandler?.();
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenLastCalledWith(600);
    });

    it('should not exceed reasonable callback count during animation simulation', () => {
      const callback = vi.fn();

      // 50ms throttle
      subscribeKeyboardHeight({ callback, throttleMs: 50 });

      const resizeHandler = mockVisualViewport.addEventListener.mock.calls.find(call => call[0] === 'resize')?.[1];

      // Simulate 500ms of animation with events every 10ms
      // Without throttle: 50 events, With 50ms throttle: ~10 events max
      for (let i = 0; i < 50; i++) {
        mockVisualViewport.height = 500 - i * 6; // Gradually decrease viewport (keyboard appearing)
        resizeHandler?.();
        vi.advanceTimersByTime(10);
      }

      // With 50ms throttle, we should have at most 11 calls (500ms / 50ms + 1)
      expect(callback.mock.calls.length).toBeLessThanOrEqual(11);
      expect(callback.mock.calls.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('cleanup', () => {
    it('should clear throttle timer on unsubscribe', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      const callback = vi.fn();

      const { unsubscribe } = subscribeKeyboardHeight({ callback, throttleMs: 100 });

      const resizeHandler = mockVisualViewport.addEventListener.mock.calls.find(call => call[0] === 'resize')?.[1];

      // Trigger an event to start throttle timer
      resizeHandler?.();

      // Unsubscribe while throttle is active
      unsubscribe();

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });
});
