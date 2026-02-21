/**
 * @vitest-environment node
 *
 * SSR environment tests - runs in Node.js where window is truly undefined
 */
import { describe, expect, it } from 'vitest';

import { disableBodyScrollLock } from './disableBodyScrollLock.ts';

describe('disableBodyScrollLock SSR environment', () => {
  it('should do nothing when disableBodyScrollLock is called on server', () => {
    // In Node environment, window is undefined
    expect(typeof window).toBe('undefined');
    expect(() => disableBodyScrollLock()).not.toThrow();
  });
});
