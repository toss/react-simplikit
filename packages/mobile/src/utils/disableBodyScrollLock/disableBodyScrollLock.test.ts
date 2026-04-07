import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { enableBodyScrollLock } from '../enableBodyScrollLock/index.ts';

import { disableBodyScrollLock } from './disableBodyScrollLock.ts';

describe('disableBodyScrollLock', () => {
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

  it('should restore body styles after unlock', () => {
    enableBodyScrollLock();
    disableBodyScrollLock();

    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.position).toBe('');
    expect(document.body.style.top).toBe('');
    expect(document.body.style.left).toBe('');
    expect(document.body.style.right).toBe('');
    expect(document.body.style.bottom).toBe('');
  });

  it('should restore scroll position', () => {
    Object.defineProperty(window, 'scrollY', { value: 300 });

    enableBodyScrollLock();
    disableBodyScrollLock();

    expect(window.scrollTo).toHaveBeenCalledWith(0, 300);
  });

  it('should remove scroll position attribute', () => {
    enableBodyScrollLock();
    disableBodyScrollLock();

    expect(document.body.getAttribute(SCROLL_POSITION_ATTR)).toBeNull();
  });

  it('should do nothing if not locked', () => {
    disableBodyScrollLock();

    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  describe('edge cases', () => {
    it('should handle negative scroll position gracefully', () => {
      Object.defineProperty(window, 'scrollY', { value: -100 });

      enableBodyScrollLock();
      disableBodyScrollLock();

      expect(window.scrollTo).toHaveBeenCalledWith(0, -100);
    });

    it('should handle invalid scroll position with NaN', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      enableBodyScrollLock();
      // Manually corrupt the saved scroll position
      document.body.setAttribute(SCROLL_POSITION_ATTR, 'invalid');
      disableBodyScrollLock();

      expect(consoleWarnSpy).toHaveBeenCalledWith('[@react-simplikit/mobile] Invalid scroll position, defaulting to 0');
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);

      consoleWarnSpy.mockRestore();
    });
  });
});
