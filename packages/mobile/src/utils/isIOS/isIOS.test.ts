import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { isIOS } from './isIOS.ts';

describe('isIOS', () => {
  const originalPlatform = navigator.platform;
  const originalMaxTouchPoints = navigator.maxTouchPoints;

  beforeEach(() => {
    // Reset to default values before each test
    Object.defineProperty(navigator, 'platform', {
      value: originalPlatform,
      configurable: true,
    });
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: originalMaxTouchPoints,
      configurable: true,
    });
  });

  afterEach(() => {
    // Restore original values after each test
    Object.defineProperty(navigator, 'platform', {
      value: originalPlatform,
      configurable: true,
    });
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: originalMaxTouchPoints,
      configurable: true,
    });
  });

  it('should detect iOS (iPhone)', () => {
    expect(isIOS('Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)')).toBe(true);
  });

  it('should detect iOS (iPad)', () => {
    expect(isIOS('Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X)')).toBe(true);
  });

  it('should detect iOS (iPod)', () => {
    expect(isIOS('Mozilla/5.0 (iPod touch; CPU iPhone OS 15_0 like Mac OS X)')).toBe(true);
  });

  it('should detect iPadOS (MacIntel + touch)', () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'MacIntel',
      configurable: true,
    });
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 5,
      configurable: true,
    });

    expect(isIOS('Mozilla/5.0 (Macintosh; Intel Mac OS X)')).toBe(true);
  });

  it('should return false for Android', () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'Linux armv8l',
      configurable: true,
    });
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 0,
      configurable: true,
    });

    expect(isIOS('Mozilla/5.0 (Linux; Android 12; Pixel 6) Chrome/120')).toBe(false);
  });

  it('should return false for desktop browser', () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'Win32',
      configurable: true,
    });
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 0,
      configurable: true,
    });

    expect(isIOS('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120')).toBe(false);
  });
});
