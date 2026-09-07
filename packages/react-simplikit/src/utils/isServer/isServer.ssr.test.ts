/**
 * @vitest-environment node
 *
 * SSR environment tests - runs in Node.js where window is truly undefined
 */
import { describe, expect, it } from 'vitest';

import { isServer } from './isServer.ts';

describe('isServer SSR environment', () => {
  it('should return true in Node.js environment (server-side)', () => {
    expect(typeof window).toBe('undefined');
    expect(isServer()).toBe(true);
  });

  it('should return consistent results on multiple calls in SSR', () => {
    const firstCall = isServer();
    const secondCall = isServer();
    const thirdCall = isServer();

    expect(firstCall).toBe(true);
    expect(secondCall).toBe(true);
    expect(thirdCall).toBe(true);
  });
});
