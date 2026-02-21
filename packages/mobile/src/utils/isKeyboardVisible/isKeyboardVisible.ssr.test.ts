/**
 * @vitest-environment node
 *
 * SSR environment tests - runs in Node.js where window is truly undefined
 */
import { describe, expect, it } from 'vitest';

import { isKeyboardVisible } from './isKeyboardVisible.ts';

describe('isKeyboardVisible SSR environment', () => {
  it('should return false in SSR environment', () => {
    expect(typeof window).toBe('undefined');
    expect(isKeyboardVisible()).toBe(false);
  });
});
