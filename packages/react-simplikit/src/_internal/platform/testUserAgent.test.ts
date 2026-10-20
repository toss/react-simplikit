import { afterEach, describe, expect, it } from 'vitest';

import { serverEnvironments } from '../test-utils/serverEnvironments.ts';

import { testUserAgent } from './testUserAgent.ts';
import type { NavigatorUAData } from './types.ts';

describe('testUserAgent', () => {
  const originalUserAgent = navigator.userAgent;
  const originalDescriptor = Object.getOwnPropertyDescriptor(Navigator.prototype, 'userAgentData');

  afterEach(function restoreNavigator() {
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true,
    });

    if (originalDescriptor == null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- cleanup test stub
      delete (navigator as any).userAgentData;
      return;
    }

    Object.defineProperty(Navigator.prototype, 'userAgentData', originalDescriptor);
  });

  function stubUserAgentData(userAgentData: NavigatorUAData | undefined) {
    Object.defineProperty(navigator, 'userAgentData', {
      value: userAgentData,
      configurable: true,
    });
  }

  it('returns true when a Client Hints brand matches', () => {
    stubUserAgentData({
      brands: [
        { brand: 'Chromium', version: '120' },
        { brand: 'Google Chrome', version: '120' },
      ],
      mobile: false,
      platform: 'Windows',
    });
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      configurable: true,
    });

    expect(testUserAgent(/Chrome/i)).toBe(true);
  });

  it('falls back to navigator.userAgent when brands do not match', () => {
    stubUserAgentData({
      brands: [{ brand: 'Chromium', version: '120' }],
      mobile: true,
      platform: 'Android',
    });
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) Chrome/126',
      configurable: true,
    });

    expect(testUserAgent(/Android/i)).toBe(true);
  });

  it('falls back to navigator.userAgent when userAgentData is missing', () => {
    stubUserAgentData(undefined);
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) Chrome/126',
      configurable: true,
    });

    expect(testUserAgent(/Android/i)).toBe(true);
  });

  it('returns false when neither brands nor userAgent match', () => {
    stubUserAgentData({
      brands: [{ brand: 'Chromium', version: '120' }],
      mobile: false,
      platform: 'Windows',
    });
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      configurable: true,
    });

    expect(testUserAgent(/Android/i)).toBe(false);
  });

  it('returns false on the server', () => {
    const result = serverEnvironments(() => testUserAgent(/Android/i));

    expect(result).toBe(false);
  });
});
