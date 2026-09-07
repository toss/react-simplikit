/**
 * @vitest-environment node
 *
 * SSR environment tests - runs in Node.js where window is truly undefined
 */
import { describe, expect, it, vi } from 'vitest';

import { subscribeKeyboardHeight } from './subscribeKeyboardHeight.ts';

describe('subscribeKeyboardHeight SSR environment', () => {
  it('should return noop unsubscribe in SSR environment', () => {
    expect(typeof window).toBe('undefined');

    const callback = vi.fn();
    const { unsubscribe } = subscribeKeyboardHeight({ callback });

    expect(typeof unsubscribe).toBe('function');
    expect(() => unsubscribe()).not.toThrow();
    expect(callback).not.toHaveBeenCalled();
  });
});
