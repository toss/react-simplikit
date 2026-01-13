import { describe, expect, it } from 'vitest';

import { isAndroid, isIOS } from './device.ts';

describe('device utils', () => {
  it('should detect iOS', () => {
    expect(isIOS('Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)')).toBe(true);
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

  it('should detect Android', () => {
    expect(isAndroid('Mozilla/5.0 (Linux; Android 12; Pixel 6) Chrome/120')).toBe(true);
  });
});
