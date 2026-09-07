/**
 * @vitest-environment node
 *
 * SSR environment tests - runs in Node.js where window is truly undefined
 */
import { describe, expect, it } from 'vitest';

import { isIOS } from './isIOS.ts';

describe('isIOS SSR environment', () => {
  it('should return false in SSR environment', () => {
    expect(typeof window).toBe('undefined');
    expect(isIOS()).toBe(false);
  });
});
