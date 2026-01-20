/**
 * @vitest-environment node
 *
 * SSR environment tests - runs in Node.js where window is truly undefined
 */
import { describe, expect, it } from 'vitest';

import { getSafeAreaInset } from './getSafeAreaInset.ts';

describe('getSafeAreaInset SSR environment', () => {
  it('should return 0 for all positions on server', () => {
    // In Node environment, window is undefined
    expect(typeof window).toBe('undefined');
    expect(getSafeAreaInset('top')).toBe(0);
    expect(getSafeAreaInset('bottom')).toBe(0);
    expect(getSafeAreaInset('left')).toBe(0);
    expect(getSafeAreaInset('right')).toBe(0);
  });

  it('should not throw when called on server', () => {
    // In Node environment, window is undefined
    expect(typeof window).toBe('undefined');
    expect(() => getSafeAreaInset('top')).not.toThrow();
    expect(() => getSafeAreaInset('bottom')).not.toThrow();
    expect(() => getSafeAreaInset('left')).not.toThrow();
    expect(() => getSafeAreaInset('right')).not.toThrow();
  });

  it('should return consistent results on multiple calls in SSR', () => {
    const top1 = getSafeAreaInset('top');
    const top2 = getSafeAreaInset('top');
    const top3 = getSafeAreaInset('top');

    expect(top1).toBe(0);
    expect(top2).toBe(0);
    expect(top3).toBe(0);
    expect(top1).toBe(top2);
    expect(top2).toBe(top3);
  });
});
