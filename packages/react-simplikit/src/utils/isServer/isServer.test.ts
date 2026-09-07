import { describe, expect, it } from 'vitest';

import { isServer } from './isServer.ts';

describe('isServer', () => {
  it('should return false in jsdom environment (client-side)', () => {
    expect(typeof window).toBe('object');
    expect(isServer()).toBe(false);
  });

  it('should return consistent results on multiple calls', () => {
    const firstCall = isServer();
    const secondCall = isServer();
    const thirdCall = isServer();

    expect(firstCall).toBe(false);
    expect(secondCall).toBe(false);
    expect(thirdCall).toBe(false);
  });
});
