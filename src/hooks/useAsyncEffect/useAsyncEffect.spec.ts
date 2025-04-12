import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useAsyncEffect } from './useAsyncEffect.ts';

describe('useAsyncEffect', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  const flushPromises = () => act(async () => await Promise.resolve());

  it('is safe on server side rendering', async () => {
    const effect = vi.fn().mockResolvedValue(undefined);

    renderHookSSR.serverOnly(() => useAsyncEffect(effect, []));

    expect(effect).not.toHaveBeenCalled();
  });

  it('should execute async effect', async () => {
    const effect = vi.fn().mockResolvedValue(undefined);

    await renderHookSSR(() => useAsyncEffect(effect, []));
    expect(effect).toHaveBeenCalled();
  });

  it('should handle successful async operations', async () => {
    const result = { data: 'test' };
    let capturedData: typeof result | null = null;

    await renderHookSSR(() =>
      useAsyncEffect(async () => {
        const data = await Promise.resolve(result);
        capturedData = data;
      }, [])
    );

    await flushPromises();

    expect(capturedData).toEqual(result);
  });

  it('should execute cleanup function when provided', async () => {
    const cleanup = vi.fn();
    const { unmount } = await renderHookSSR(() =>
      useAsyncEffect(async () => {
        return cleanup;
      }, [])
    );

    await flushPromises();

    unmount();
    expect(cleanup).toHaveBeenCalled();
  });

  it('should handle dependency changes', async () => {
    const cleanup = vi.fn();
    const effect = vi.fn().mockResolvedValue(cleanup);

    const { rerender } = await renderHookSSR(({ dep }) => useAsyncEffect(effect, [dep]), {
      initialProps: { dep: 1 },
    });

    await flushPromises();
    rerender({ dep: 2 });

    expect(effect).toHaveBeenCalledTimes(2);
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('should handle delayed async operations', async () => {
    const cleanup = vi.fn();
    const { unmount } = await renderHookSSR(() =>
      useAsyncEffect(async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return cleanup;
      }, [])
    );

    await flushPromises();
    vi.advanceTimersByTime(1000);
    await flushPromises();

    unmount();
    expect(cleanup).toHaveBeenCalled();
  });

  it('should call effect every rerender when deps are undefined', async () => {
    const effect = vi.fn().mockResolvedValue(undefined);

    const { rerender } = await renderHookSSR(() => useAsyncEffect(effect));

    await flushPromises();

    expect(effect).toHaveBeenCalled();

    rerender();

    expect(effect).toHaveBeenCalledTimes(2);

    rerender();
    expect(effect).toHaveBeenCalledTimes(3);
  });
});
