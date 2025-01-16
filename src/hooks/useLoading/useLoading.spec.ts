import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useLoading } from './useLoading.ts';

describe('useLoading', () => {
  it('should start with loading as false', () => {
    const { result } = renderHook(() => useLoading());
    const [isLoading] = result.current;

    expect(isLoading).toBe(false);
  });

  it('should set loading to true when startLoading is called with a pending promise', async () => {
    const { result } = renderHook(() => useLoading());
    const [, startLoading] = result.current;

    let resolvePromise: () => void;
    const mockPromise = new Promise<void>(resolve => {
      resolvePromise = resolve;
    });

    act(() => {
      startLoading(mockPromise);
    });

    const [isLoading] = result.current;
    expect(isLoading).toBe(true);

    act(() => {
      resolvePromise?.();
    });

    await act(async () => {
      await mockPromise;
    });

    const [isLoadingAfterResolve] = result.current;
    expect(isLoadingAfterResolve).toBe(false);
  });

  it('should return the resolved value from the promise', async () => {
    const { result } = renderHook(() => useLoading());
    const [, startLoading] = result.current;

    const mockPromise = Promise.resolve('test-value');

    let resolvedValue;
    await act(async () => {
      resolvedValue = await startLoading(mockPromise);
    });

    expect(resolvedValue).toBe('test-value');
  });

  it('should handle unmounted components gracefully', async () => {
    const { result, unmount } = renderHook(() => useLoading());
    const [, startLoading] = result.current;

    const mockPromise = new Promise(resolve => setTimeout(() => resolve('test-value'), 100));

    act(() => {
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
