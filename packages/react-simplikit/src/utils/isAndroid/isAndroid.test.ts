import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { NavigatorUAData } from '../../_internal/platform/types.ts';

import { isAndroid } from './isAndroid.ts';

describe('isAndroid', () => {
  const originalUserAgent = navigator.userAgent;
  const originalPlatform = navigator.platform;
  const originalUserAgentDataDescriptor = Object.getOwnPropertyDescriptor(Navigator.prototype, 'userAgentData');

  function stubUserAgentData(userAgentData: NavigatorUAData | undefined) {
    Object.defineProperty(navigator, 'userAgentData', {
      value: userAgentData,
      configurable: true,
    });
  }

  beforeEach(() => {
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true,
    });
    Object.defineProperty(navigator, 'platform', {
      value: originalPlatform,
      configurable: true,
    });
    stubUserAgentData(undefined);
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true,
    });
    Object.defineProperty(navigator, 'platform', {
      value: originalPlatform,
      configurable: true,
    });

    if (originalUserAgentDataDescriptor == null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- cleanup test stub
      delete (navigator as any).userAgentData;
      return;
    }

    Object.defineProperty(Navigator.prototype, 'userAgentData', originalUserAgentDataDescriptor);
  });

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
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) Chrome/126',
      configurable: true,
    });

    expect(isAndroid()).toBe(true);
  });

  it('should detect Android from userAgentData.platform', () => {
    stubUserAgentData({
      brands: [{ brand: 'Chromium', version: '120' }],
      mobile: true,
      platform: 'Android',
    });
    Object.defineProperty(navigator, 'platform', {
      value: 'Linux armv8l',
      configurable: true,
    });
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/120',
      configurable: true,
    });

    expect(isAndroid()).toBe(true);
  });

  it('should return false when Client Hints and userAgent are not Android', () => {
    stubUserAgentData({
      brands: [{ brand: 'Chromium', version: '120' }],
      mobile: false,
      platform: 'Windows',
    });
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120',
      configurable: true,
    });

    expect(isAndroid()).toBe(false);
  });
});
