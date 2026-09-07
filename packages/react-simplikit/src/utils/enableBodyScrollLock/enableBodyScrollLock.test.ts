import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { disableBodyScrollLock } from '../disableBodyScrollLock/index.ts';

import { enableBodyScrollLock } from './enableBodyScrollLock.ts';

describe('enableBodyScrollLock', () => {
  const SCROLL_POSITION_ATTR = 'data-simplikit-scroll-y';

  beforeEach(() => {
    document.body.style.cssText = '';
    document.body.removeAttribute(SCROLL_POSITION_ATTR);

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

  it('should set body styles for scroll lock', () => {
    enableBodyScrollLock();

    expect(document.body.style.overflow).toBe('hidden');
    expect(document.body.style.position).toBe('fixed');
    expect(document.body.style.left).toBe('0px');
    expect(document.body.style.right).toBe('0px');
    expect(document.body.style.bottom).toBe('0px');
  });

  it('should save current scroll position', () => {
    Object.defineProperty(window, 'scrollY', { value: 500 });

    enableBodyScrollLock();

    expect(document.body.getAttribute(SCROLL_POSITION_ATTR)).toBe('500');
    expect(document.body.style.top).toBe('-500px');
  });

  it('should not apply lock twice (prevent duplicate calls)', () => {
    Object.defineProperty(window, 'scrollY', { value: 100 });
    enableBodyScrollLock();

    // Change scroll position and call again
    Object.defineProperty(window, 'scrollY', { value: 200 });
    enableBodyScrollLock();

    // Should still have the first scroll position
    expect(document.body.getAttribute(SCROLL_POSITION_ATTR)).toBe('100');
    expect(document.body.style.top).toBe('-100px');
  });

  describe('lock/unlock cycle', () => {
    it('should handle multiple lock/unlock cycles correctly', () => {
      Object.defineProperty(window, 'scrollY', { value: 100 });

      // First cycle
      enableBodyScrollLock();
      expect(document.body.style.position).toBe('fixed');
      disableBodyScrollLock();
      expect(document.body.style.position).toBe('');

      // Second cycle with different scroll position
      Object.defineProperty(window, 'scrollY', { value: 200 });
      enableBodyScrollLock();
      expect(document.body.getAttribute(SCROLL_POSITION_ATTR)).toBe('200');
      disableBodyScrollLock();
      expect(window.scrollTo).toHaveBeenLastCalledWith(0, 200);
    });
  });

  describe('edge cases', () => {
    it('should handle zero scroll position', () => {
      Object.defineProperty(window, 'scrollY', { value: 0 });

      enableBodyScrollLock();

      // Note: `-0px` and `0px` are functionally equivalent
      expect(['0px', '-0px']).toContain(document.body.style.top);
      expect(document.body.getAttribute(SCROLL_POSITION_ATTR)).toBe('0');
    });

    it('should handle large scroll position', () => {
      Object.defineProperty(window, 'scrollY', { value: 999999 });

      enableBodyScrollLock();

      expect(document.body.style.top).toBe('-999999px');
      expect(document.body.getAttribute(SCROLL_POSITION_ATTR)).toBe('999999');
    });
  });
});
