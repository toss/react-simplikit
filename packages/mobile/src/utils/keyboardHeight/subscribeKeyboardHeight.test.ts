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

    subscribeKeyboardHeight({ callback });

    const resizeHandler = mockVisualViewport.addEventListener.mock.calls.find(call => call[0] === 'resize')?.[1];

    resizeHandler?.();

    expect(callback).toHaveBeenCalledWith(300);
  });

  it('should call callback with keyboard height on scroll event', () => {
    const callback = vi.fn();

    subscribeKeyboardHeight({ callback });

    const scrollHandler = mockVisualViewport.addEventListener.mock.calls.find(call => call[0] === 'scroll')?.[1];

    scrollHandler?.();

    expect(callback).toHaveBeenCalledWith(300);
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
});
