/**
 * @vitest-environment node
 *
 * SSR environment tests - runs in Node.js where window is truly undefined
 */
import { describe, expect, it } from 'vitest';

import { getSafeAreaInset } from './getSafeAreaInset.ts';

describe('getSafeAreaInset SSR environment', () => {
  it('should return object with all zeros on server', () => {
    // In Node environment, window is undefined
    expect(typeof window).toBe('undefined');
    expect(getSafeAreaInset()).toEqual({ top: 0, bottom: 0, left: 0, right: 0 });
  });

  it('should not throw when called on server', () => {
    // In Node environment, window is undefined
    expect(typeof window).toBe('undefined');
    expect(() => getSafeAreaInset()).not.toThrow();
  });

  it('should return consistent results on multiple calls in SSR', () => {
    const result1 = getSafeAreaInset();
    const result2 = getSafeAreaInset();
    const result3 = getSafeAreaInset();

    expect(result1).toEqual({ top: 0, bottom: 0, left: 0, right: 0 });
    expect(result2).toEqual({ top: 0, bottom: 0, left: 0, right: 0 });
    expect(result3).toEqual({ top: 0, bottom: 0, left: 0, right: 0 });
  });
});
