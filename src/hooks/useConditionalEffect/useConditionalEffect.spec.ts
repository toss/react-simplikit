import { act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useConditionalEffect } from './useConditionalEffect.ts';

describe('useConditionalEffect', () => {
  it('is safe on server side rendering', () => {
    const effect = vi.fn();
    const condition = vi.fn(() => false);

    renderHookSSR.serverOnly(() => useConditionalEffect(effect, [1], condition));

    expect(condition).toHaveBeenCalled();
    expect(effect).not.toHaveBeenCalled();
  });

  it('should not run effect when condition returns false', async () => {
    const effect = vi.fn();
    const condition = vi.fn(() => false);

    await renderHookSSR(() => useConditionalEffect(effect, [1], condition));

    expect(condition).toHaveBeenCalledWith(undefined, [1]);
    expect(effect).not.toHaveBeenCalled();
  });

  it('should run effect when condition returns true', async () => {
    const effect = vi.fn();
    const condition = vi.fn(() => true);

    await renderHookSSR(() => useConditionalEffect(effect, [1], condition));

    expect(condition).toHaveBeenCalledWith(undefined, [1]);
    expect(effect).toHaveBeenCalled();
  });

  it('should warn when an empty dependency array is provided', async () => {
    const originalWarn = console.warn;
    console.warn = vi.fn();

    const effect = vi.fn();
    const condition = vi.fn(() => true);

    await renderHookSSR(() => useConditionalEffect(effect, [], condition));

    expect(console.warn).toHaveBeenCalledWith(
      'useConditionalEffect received an empty dependency array. ' +
        'This may indicate missing dependencies and could lead to unexpected behavior.'
    );

    console.warn = originalWarn;
  });

  it('should run effect multiple times when condition is repeatedly true', async () => {
    const effect = vi.fn();
    const condition = vi.fn(() => true);

    const { rerender } = await renderHookSSR(({ deps }) => useConditionalEffect(effect, deps, condition), {
      initialProps: { deps: [1] as const },
    });

    expect(effect).toHaveBeenCalledTimes(1);

    // First rerender
    effect.mockClear();
    await act(async () => {
      rerender({ deps: [2] as const });
    });

    expect(condition).toHaveBeenCalledWith([1], [2]);
    expect(effect).toHaveBeenCalledTimes(1);

    // Second rerender
    effect.mockClear();
    await act(async () => {
      rerender({ deps: [3] as const });
    });

    expect(condition).toHaveBeenCalledWith([2], [3]);
    expect(effect).toHaveBeenCalledTimes(1);
  });

  it('should run cleanup function when effect returns one', async () => {
    const cleanup = vi.fn();
    const effect = vi.fn(() => cleanup);
    const condition = vi.fn(() => true);

    const { unmount } = await renderHookSSR(() => useConditionalEffect(effect, [1], condition));

    unmount();

    expect(cleanup).toHaveBeenCalled();
  });

  it('should store deps for next comparison', async () => {
    const effect = vi.fn();
    const condition = vi.fn(() => false);

    const { rerender } = await renderHookSSR(({ deps }) => useConditionalEffect(effect, deps, condition), {
      initialProps: { deps: [1] as const },
    });

    // First call receives undefined for prevDeps
    expect(condition).toHaveBeenCalledWith(undefined, [1]);

    condition.mockClear();

    // Rerender with new deps
    await act(async () => {
      rerender({ deps: [2] as const });
    });

    // Second call should receive the previous deps
    expect(condition).toHaveBeenCalledWith([1], [2]);
  });

  it('should run effect based on conditional logic', async () => {
    const effect = vi.fn();
    // Only run when the number increases
    const condition = vi.fn((prev: readonly number[] | undefined, current: readonly number[]) => {
      if (prev === undefined) return false;
      return current[0] > prev[0];
    });

    const { rerender } = await renderHookSSR(({ count }) => useConditionalEffect(effect, [count], condition), {
      initialProps: { count: 0 },
    });

    expect(effect).not.toHaveBeenCalled();

    // Increase the count
    effect.mockClear();
    condition.mockClear();

    await act(async () => {
      rerender({ count: 1 });
    });

    expect(condition).toHaveBeenCalledWith([0], [1]);
    expect(effect).toHaveBeenCalled();

    // Decrease the count
    effect.mockClear();
    condition.mockClear();

    await act(async () => {
      rerender({ count: 0 });
    });

    expect(condition).toHaveBeenCalledWith([1], [0]);
    expect(effect).not.toHaveBeenCalled();
  });
});
