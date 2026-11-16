import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { enableBodyScrollLock } from '../enableBodyScrollLock/index.ts';

import { disableBodyScrollLock } from './disableBodyScrollLock.ts';

describe('disableBodyScrollLock', () => {
  const SCROLL_POSITION_ATTR = 'data-simplikit-scroll-y';
  const BODY_STYLE_ATTR = 'data-simplikit-body-style';

  beforeEach(() => {
    document.body.style.cssText = '';
    document.body.removeAttribute(SCROLL_POSITION_ATTR);
    document.body.removeAttribute(BODY_STYLE_ATTR);

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

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 300, left: 0, behavior: 'instant' });
  });

  it('should remove the saved data attributes', () => {
    enableBodyScrollLock();
    disableBodyScrollLock();

    expect(document.body.getAttribute(SCROLL_POSITION_ATTR)).toBeNull();
    expect(document.body.getAttribute(BODY_STYLE_ATTR)).toBeNull();
  });

  it('should restore inline styles the body had before the lock', () => {
    document.body.style.cssText = 'overflow-y: scroll; position: relative; top: 10px;';

    enableBodyScrollLock();
    disableBodyScrollLock();

    expect(document.body.style.overflowX).toBe('');
    expect(document.body.style.overflowY).toBe('scroll');
    expect(document.body.style.position).toBe('relative');
    expect(document.body.style.top).toBe('10px');
    expect(document.body.style.left).toBe('');
    expect(document.body.style.right).toBe('');
    expect(document.body.style.bottom).toBe('');
  });

  it('should restore the priority of inline styles', () => {
    document.body.style.setProperty('overflow', 'auto', 'important');

    enableBodyScrollLock();
    disableBodyScrollLock();

    expect(document.body.style.getPropertyValue('overflow')).toBe('auto');
    expect(document.body.style.getPropertyPriority('overflow')).toBe('important');
  });

  it('should keep inline styles changed during the lock that it does not manage', () => {
    enableBodyScrollLock();
    document.body.style.backgroundColor = 'red';
    disableBodyScrollLock();

    expect(document.body.style.backgroundColor).toBe('red');
  });

  it('should keep a managed inline style changed during the lock', () => {
    enableBodyScrollLock();
    document.body.style.top = '-50px';
    disableBodyScrollLock();

    expect(document.body.style.top).toBe('-50px');
    expect(document.body.style.position).toBe('');
  });

  it('should not bring back a style another lock released out of order', () => {
    // Another lock that saves and restores `overflow` opens first and closes first
    const overflowBeforeOtherLock = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    enableBodyScrollLock();
    document.body.style.overflow = overflowBeforeOtherLock;
    disableBodyScrollLock();

    expect(document.body.style.overflow).toBe('');
  });

  it('should remove lock styles when no inline styles were saved', () => {
    enableBodyScrollLock();
    // A lock applied without saving the inline styles, e.g. by an older version
    document.body.removeAttribute(BODY_STYLE_ATTR);
    disableBodyScrollLock();

    expect(document.body.style.overflow).toBe('');
    expect(document.body.style.position).toBe('');
    expect(document.body.style.top).toBe('');
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

      expect(window.scrollTo).toHaveBeenCalledWith({ top: -100, left: 0, behavior: 'instant' });
    });

    it('should handle invalid scroll position with NaN', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      enableBodyScrollLock();
      // Manually corrupt the saved scroll position
      document.body.setAttribute(SCROLL_POSITION_ATTR, 'invalid');
      disableBodyScrollLock();

      expect(consoleWarnSpy).toHaveBeenCalledWith('[react-simplikit] Invalid scroll position, defaulting to 0');
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' });

      consoleWarnSpy.mockRestore();
    });
  });
});
