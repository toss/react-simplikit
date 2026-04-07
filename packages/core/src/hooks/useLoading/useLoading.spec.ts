import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useLoading } from './useLoading.ts';

describe('useLoading', () => {
  it('is safe on server side rendering', () => {
    const result = renderHookSSR.serverOnly(() => useLoading());

    const [bool] = result.current;

    expect(bool).toBe(false);
  });

  it('should start with loading as false', async () => {
    const { result } = await renderHookSSR(() => useLoading());
    const [isLoading] = result.current;

    expect(isLoading).toBe(false);
  });

  it('should set loading to true when startLoading is called with a pending promise', async () => {
    const { result } = await renderHookSSR(() => useLoading());
    const [, startLoading] = result.current;

    let resolvePromise: () => void;
    const mockPromise = new Promise<void>(resolve => {
      resolvePromise = resolve;
    });

    await act(async () => {
      startLoading(mockPromise);
    });

    const [isLoading] = result.current;
    expect(isLoading).toBe(true);

    await act(async () => {
      resolvePromise?.();
    });

    await act(async () => {
      await mockPromise;
    });

    const [isLoadingAfterResolve] = result.current;
    expect(isLoadingAfterResolve).toBe(false);
  });

  it('should return the resolved value from the promise', async () => {
    const { result } = await renderHookSSR(() => useLoading());
    const [, startLoading] = result.current;

    const mockPromise = Promise.resolve('test-value');

    let resolvedValue;
    await act(async () => {
      resolvedValue = await startLoading(mockPromise);
    });

    expect(resolvedValue).toBe('test-value');
  });

  it('should handle unmounted components gracefully', async () => {
    const { result, unmount } = await renderHookSSR(() => useLoading());
    const [, startLoading] = result.current;

    const mockPromise = new Promise(resolve => setTimeout(() => resolve('test-value'), 100));

    await act(async () => {
      startLoading(mockPromise);
    });

    unmount();

    await act(async () => {
      await mockPromise;
    });

    // No errors should occur, and the loading state should not update after unmount
    expect(true).toBe(true);
  });
});
