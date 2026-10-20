import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { NavigatorUAData } from '../../_internal/platform/types.ts';

import { isIOS } from './isIOS.ts';

describe('isIOS', () => {
  const originalPlatform = navigator.platform;
  const originalMaxTouchPoints = navigator.maxTouchPoints;
  const originalUserAgent = navigator.userAgent;
  const originalUserAgentDataDescriptor = Object.getOwnPropertyDescriptor(Navigator.prototype, 'userAgentData');

  function stubUserAgentData(userAgentData: NavigatorUAData | undefined) {
    Object.defineProperty(navigator, 'userAgentData', {
      value: userAgentData,
      configurable: true,
    });
  }

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
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true,
    });
    stubUserAgentData(undefined);
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
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true,
    });

    if (originalUserAgentDataDescriptor == null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- cleanup test stub
      delete (navigator as any).userAgentData;
      return;
    }

    Object.defineProperty(Navigator.prototype, 'userAgentData', originalUserAgentDataDescriptor);
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

  it('should fall back to navigator.userAgent when no argument is given', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
      configurable: true,
    });

    expect(isIOS()).toBe(true);
  });

  it('should detect iOS from userAgentData.platform', () => {
    stubUserAgentData({
      brands: [{ brand: 'Chromium', version: '120' }],
      mobile: true,
      platform: 'iOS',
    });
    Object.defineProperty(navigator, 'platform', {
      value: 'Win32',
      configurable: true,
    });
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120',
      configurable: true,
    });
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 0,
      configurable: true,
    });

    expect(isIOS()).toBe(true);
  });

  it('should detect iPadOS from userAgentData macOS platform with touch', () => {
    stubUserAgentData({
      brands: [{ brand: 'Chromium', version: '120' }],
      mobile: true,
      platform: 'macOS',
    });
    Object.defineProperty(navigator, 'platform', {
      value: 'MacIntel',
      configurable: true,
    });
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 5,
      configurable: true,
    });
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)',
      configurable: true,
    });

    expect(isIOS()).toBe(true);
  });
});
