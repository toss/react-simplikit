import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useBodyScrollLock } from './useBodyScrollLock.ts';

describe('useBodyScrollLock', () => {
  beforeEach(() => {
    // Reset body styles
    document.body.style.cssText = '';

    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });

    // Mock window.scrollTo
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should lock body scroll on mount', () => {
    renderHook(() => useBodyScrollLock());

    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.position).toBe('fixed');
    // jsdom normalizes '0' to '0px'
    expect(['0', '0px']).toContain(document.body.style.left);
    expect(['0', '0px']).toContain(document.body.style.right);
  });

  it('should preserve scroll position with negative top', () => {
    Object.defineProperty(window, 'scrollY', { value: 500 });

    renderHook(() => useBodyScrollLock());

    expect(document.body.style.top).toBe('-500px');
  });

  it('should unlock body scroll on unmount', () => {
    const { unmount } = renderHook(() => useBodyScrollLock());

    expect(document.body.style.position).toBe('fixed');

    unmount();

    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.position).toBe('');
    expect(document.body.style.top).toBe('');
    expect(document.body.style.left).toBe('');
    expect(document.body.style.right).toBe('');
  });

  it('should restore scroll position on unmount', () => {
    Object.defineProperty(window, 'scrollY', { value: 300 });

    const { unmount } = renderHook(() => useBodyScrollLock());
    unmount();

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 300, left: 0, behavior: 'instant' });
  });

  it('should handle multiple mount/unmount cycles', () => {
    // First cycle
    Object.defineProperty(window, 'scrollY', { value: 100 });
    const { unmount: unmount1 } = renderHook(() => useBodyScrollLock());
    expect(document.body.style.top).toBe('-100px');
    unmount1();
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 100, left: 0, behavior: 'instant' });

    // Second cycle with different scroll position
    Object.defineProperty(window, 'scrollY', { value: 200 });
    const { unmount: unmount2 } = renderHook(() => useBodyScrollLock());
    expect(document.body.style.top).toBe('-200px');
    unmount2();
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 200, left: 0, behavior: 'instant' });
  });

  it('should restore inline styles the body had before mount', () => {
    document.body.style.cssText = 'overflow-y: scroll; position: relative;';

    const { unmount } = renderHook(() => useBodyScrollLock());
    unmount();

    expect(document.body.style.overflowY).toBe('scroll');
    expect(document.body.style.position).toBe('relative');
  });
});
