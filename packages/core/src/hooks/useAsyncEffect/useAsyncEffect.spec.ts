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

  it('should call cleanup even when component unmounts before async effect resolves', async () => {
    const cleanup = vi.fn();
    const { unmount } = await renderHookSSR(() =>
      useAsyncEffect(async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return cleanup;
      }, [])
    );

    await flushPromises();
    unmount();
    expect(cleanup).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    await flushPromises();

    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('should pass an AbortSignal to the effect', async () => {
    let receivedSignal: AbortSignal | null = null;

    await renderHookSSR(() =>
      useAsyncEffect(async signal => {
        receivedSignal = signal;
      }, [])
    );

    await flushPromises();

    expect(receivedSignal).toBeInstanceOf(AbortSignal);
    expect(receivedSignal!.aborted).toBe(false);
  });

  it('should abort the signal when the component unmounts', async () => {
    let receivedSignal: AbortSignal | null = null;
    const { unmount } = await renderHookSSR(() =>
      useAsyncEffect(async signal => {
        receivedSignal = signal;
      }, [])
    );

    await flushPromises();
    expect(receivedSignal!.aborted).toBe(false);

    unmount();
    expect(receivedSignal!.aborted).toBe(true);
  });

  it('should fully clean up the previous instance when dependencies change', async () => {
    const signals: AbortSignal[] = [];
    const cleanup = vi.fn();

    const { rerender } = await renderHookSSR(
      ({ dep }) =>
        useAsyncEffect(
          async signal => {
            signals.push(signal);
            return cleanup;
          },
          [dep]
        ),
      {
        initialProps: { dep: 1 },
      }
    );

    await flushPromises();
    rerender({ dep: 2 });
    await flushPromises();

    expect(signals).toHaveLength(2);
    // The previous instance is fully torn down: its cleanup ran and its signal was aborted.
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(signals[0].aborted).toBe(true);
    // The current instance stays active.
    expect(signals[1].aborted).toBe(false);
  });

  it('should abort the signal with the provided reason', async () => {
    let receivedSignal: AbortSignal | null = null;
    const reason = new Error('aborted reason');

    const { unmount } = await renderHookSSR(() =>
      useAsyncEffect(
        async signal => {
          receivedSignal = signal;
        },
        [],
        reason
      )
    );

    await flushPromises();
    unmount();

    expect(receivedSignal!.aborted).toBe(true);
    expect(receivedSignal!.reason).toBe(reason);
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
