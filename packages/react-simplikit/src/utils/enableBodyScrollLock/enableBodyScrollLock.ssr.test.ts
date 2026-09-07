/**
 * @vitest-environment node
 *
 * SSR environment tests - runs in Node.js where window is truly undefined
 */
import { describe, expect, it } from 'vitest';

import { enableBodyScrollLock } from './enableBodyScrollLock.ts';

describe('enableBodyScrollLock SSR environment', () => {
  it('should do nothing when enableBodyScrollLock is called on server', () => {
    // In Node environment, window is undefined
    expect(typeof window).toBe('undefined');
    expect(() => enableBodyScrollLock()).not.toThrow();
  });
});
