import { afterEach, describe, expect, it } from 'vitest';

import { serverEnvironments } from '../test-utils/serverEnvironments.ts';

import { testPlatform } from './testPlatform.ts';
import type { NavigatorUAData } from './types.ts';

describe('testPlatform', () => {
  const originalPlatform = navigator.platform;
  const originalDescriptor = Object.getOwnPropertyDescriptor(Navigator.prototype, 'userAgentData');

  afterEach(function restoreNavigator() {
    Object.defineProperty(navigator, 'platform', {
      value: originalPlatform,
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

  it('prefers userAgentData.platform over navigator.platform', () => {
    stubUserAgentData({
      brands: [{ brand: 'Chromium', version: '120' }],
      mobile: true,
      platform: 'Android',
    });
    Object.defineProperty(navigator, 'platform', {
      value: 'Linux armv8l',
      configurable: true,
    });

    expect(testPlatform(/^Android/i)).toBe(true);
    expect(testPlatform(/^Linux/i)).toBe(false);
  });

  it('falls back to navigator.platform when userAgentData is missing', () => {
    stubUserAgentData(undefined);
    Object.defineProperty(navigator, 'platform', {
      value: 'iPhone',
      configurable: true,
    });

    expect(testPlatform(/^iPhone/i)).toBe(true);
  });

  it('matches iOS Client Hints platform', () => {
    stubUserAgentData({
      brands: [{ brand: 'Chromium', version: '120' }],
      mobile: true,
      platform: 'iOS',
    });
    Object.defineProperty(navigator, 'platform', {
      value: 'iPhone',
      configurable: true,
    });

    expect(testPlatform(/^(iPhone|iPad|iPod|iOS)/i)).toBe(true);
  });

  it('returns false when the platform does not match', () => {
    stubUserAgentData({
      brands: [{ brand: 'Chromium', version: '120' }],
      mobile: false,
      platform: 'Windows',
    });

    expect(testPlatform(/^Android/i)).toBe(false);
  });

  it('returns false on the server', () => {
    const result = serverEnvironments(() => testPlatform(/^Android/i));

    expect(result).toBe(false);
  });
});
