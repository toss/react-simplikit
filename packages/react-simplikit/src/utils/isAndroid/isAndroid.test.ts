import { describe, expect, it } from 'vitest';

import { isAndroid } from './isAndroid.ts';

describe('isAndroid', () => {
  it('should detect Android (Pixel)', () => {
    expect(isAndroid('Mozilla/5.0 (Linux; Android 12; Pixel 6) Chrome/120')).toBe(true);
  });

  it('should detect Android (Samsung)', () => {
    expect(isAndroid('Mozilla/5.0 (Linux; Android 13; SM-S908B) Chrome/120')).toBe(true);
  });

  it('should return false for iOS', () => {
    expect(isAndroid('Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)')).toBe(false);
  });

  it('should return false for desktop browser', () => {
    expect(isAndroid('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120')).toBe(false);
  });

  it('should return false for Mac browser', () => {
    expect(isAndroid('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/537.36')).toBe(false);
  });

  it('should fall back to navigator.userAgent when no argument is given', () => {
    const originalUserAgent = navigator.userAgent;
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) Chrome/126',
      configurable: true,
    });

    expect(isAndroid()).toBe(true);

    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true,
    });
  });
});
