/**
 * @vitest-environment node
 *
 * SSR environment tests - runs in Node.js where window is truly undefined
 */
import { describe, expect, it } from 'vitest';

import { getKeyboardHeight } from './getKeyboardHeight.ts';

describe('getKeyboardHeight SSR environment', () => {
  it('should return 0 in SSR environment', () => {
    expect(typeof window).toBe('undefined');
    expect(getKeyboardHeight()).toBe(0);
  });
});
