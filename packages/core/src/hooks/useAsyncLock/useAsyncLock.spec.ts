import { describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useAsyncLock } from './useAsyncLock.ts';

describe('useAsyncLock', () => {
  it('is safe on server side rendering', () => {
    const result = renderHookSSR.serverOnly(() => useAsyncLock());

    expect(result.current.isLocked()).toBe(false);
  });

  it('should execute a callback when the lock is available', async () => {
    const callback = vi.fn(() => 'done');
    const { result } = await renderHookSSR(() => useAsyncLock());

    await expect(result.current.runWithLock(callback)).resolves.toEqual({
      status: 'executed',
      data: 'done',
    });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should block overlapping executions', async () => {
    let resolvePending: (value: string) => void = () => {};
    const pending = new Promise<string>(resolve => {
      resolvePending = resolve;
    });
    const firstCallback = vi.fn(() => pending);
    const secondCallback = vi.fn(() => 'blocked');
    const { result } = renderHookSSR(() => useAsyncLock());

    const firstResult = result.current.runWithLock(firstCallback);

    expect(result.current.isLocked()).toBe(true);
    await expect(result.current.runWithLock(secondCallback)).resolves.toEqual({
      status: 'blocked',
    });
    expect(secondCallback).not.toHaveBeenCalled();

    resolvePending('done');
    await expect(firstResult).resolves.toEqual({
      status: 'executed',
      data: 'done',
    });
    expect(result.current.isLocked()).toBe(false);
  });

  it('should release the lock after a callback rejects', async () => {
    const error = new Error('failed');
    const rejectedCallback = vi.fn(async () => {
      throw error;
    });
    const nextCallback = vi.fn(() => 'next');
    const { result } = renderHookSSR(() => useAsyncLock());

    await expect(result.current.runWithLock(rejectedCallback)).rejects.toThrow(error);
    expect(result.current.isLocked()).toBe(false);

    await expect(result.current.runWithLock(nextCallback)).resolves.toEqual({
      status: 'executed',
      data: 'next',
    });
  });

  it('should keep returned functions stable across rerenders', async () => {
    const { result, rerender } = renderHookSSR(() => useAsyncLock());
    const initialValue = result.current;

    rerender();

    expect(result.current).toBe(initialValue);
    expect(result.current.runWithLock).toBe(initialValue.runWithLock);
    expect(result.current.isLocked).toBe(initialValue.isLocked);
  });
});
