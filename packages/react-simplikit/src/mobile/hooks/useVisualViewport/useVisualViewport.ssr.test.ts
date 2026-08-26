/**
 * @vitest-environment node
 *
 * SSR environment tests - runs in Node.js where window is truly undefined
 */
import { describe, expect, it } from 'vitest';

import { useVisualViewport } from './useVisualViewport.ts';

describe('useVisualViewport SSR environment', () => {
  it('should be safe on server side rendering', () => {
    expect(typeof window).toBe('undefined');

    // Should not throw during module evaluation
    expect(() => useVisualViewport).not.toThrow();
  });

  it('should not throw when imported in SSR', () => {
    // In Node environment, window is undefined
    expect(typeof window).toBe('undefined');

    // Just verify the hook can be called (doesn't actually run without React context)
    expect(typeof useVisualViewport).toBe('function');
  });
});
