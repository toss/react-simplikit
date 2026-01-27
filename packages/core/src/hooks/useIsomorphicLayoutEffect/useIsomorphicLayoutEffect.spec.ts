import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('useIsomorphicLayoutEffect', () => {
  const originalWindow = global.window;

  beforeEach(() => {
    vi.resetModules();
  });

  it('should use useEffect on server side', async () => {
    global.window = undefined as unknown as Window & typeof globalThis;

    const { useEffect, useLayoutEffect } = await import('react');
    const { useIsomorphicLayoutEffect } = await import('./useIsomorphicLayoutEffect.ts');

    expect(useIsomorphicLayoutEffect).toBe(useEffect);
    expect(useIsomorphicLayoutEffect).not.toBe(useLayoutEffect);
  });

  it('should use useLayoutEffect on client side', async () => {
    global.window = originalWindow;

    const { useEffect, useLayoutEffect } = await import('react');
    const { useIsomorphicLayoutEffect } = await import('./useIsomorphicLayoutEffect.ts');

    expect(useIsomorphicLayoutEffect).toBe(useLayoutEffect);
    expect(useIsomorphicLayoutEffect).not.toBe(useEffect);
  });

  afterEach(() => {
    global.window = originalWindow;
  });
});
