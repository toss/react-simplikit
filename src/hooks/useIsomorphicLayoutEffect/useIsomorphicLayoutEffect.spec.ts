import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('useClientLayoutEffect', () => {
  const originalWindow = global.window;

  beforeEach(() => {
    vi.resetModules();
  });

  it('should use useEffect on server side', async () => {
    global.window = undefined as unknown as Window & typeof globalThis;

    const { useEffect, useLayoutEffect } = await import('react');
    const { useClientLayoutEffect } = await import('./useClientLayoutEffect.ts');

    expect(useClientLayoutEffect).toBe(useEffect);
    expect(useClientLayoutEffect).not.toBe(useLayoutEffect);
  });

  it('should use useLayoutEffect on client side', async () => {
    global.window = originalWindow;

    const { useEffect, useLayoutEffect } = await import('react');
    const { useClientLayoutEffect } = await import('./useClientLayoutEffect.ts');

    expect(useClientLayoutEffect).toBe(useLayoutEffect);
    expect(useClientLayoutEffect).not.toBe(useEffect);
  });

  afterEach(() => {
    global.window = originalWindow;
  });
});
