import { act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { usePreservedCallback } from './usePreservedCallback.ts';

describe('usePreservedCallback', () => {
  it('is safe on server side rendering', () => {
    const callback = vi.fn();
    renderHookSSR.serverOnly(() => usePreservedCallback(callback));

    expect(callback).not.toHaveBeenCalled();
  });

  it('should return the same callback instance initially', async () => {
    const callback = vi.fn();
    const { result } = await renderHookSSR(() => usePreservedCallback(callback));

    const preservedCallback = result.current;

    expect(typeof preservedCallback).toBe('function');
    preservedCallback();
    expect(callback).toHaveBeenCalled();
  });
  it('should always call the latest version of the callback', async () => {
    const initialCallback = vi.fn();
    const updatedCallback = vi.fn();

    const { result, rerender } = await renderHookSSR(({ callback }) => usePreservedCallback(callback), {
      initialProps: { callback: initialCallback },
    });

    // Call the preserved callback with the initial callback
    act(() => {
      result.current();
    });
    expect(initialCallback).toHaveBeenCalledTimes(1);

    // Update the callback
    rerender({ callback: updatedCallback });

    // Call the preserved callback with the updated callback
    act(() => {
      result.current();
    });
    expect(updatedCallback).toHaveBeenCalledTimes(1);
    expect(initialCallback).toHaveBeenCalledTimes(1); // Ensure the old callback is not called again
  });

  it('should correctly pass arguments to the callback', async () => {
    const callback = vi.fn((a: number, b: number) => a + b);
    const { result } = await renderHookSSR(() => usePreservedCallback(callback));

    act(() => {
      result.current(2, 3);
    });

    expect(callback).toHaveBeenCalledWith(2, 3);
    expect(callback).toHaveReturnedWith(5);
  });
  it('should not create a new function instance unnecessarily', async () => {
    const callback = vi.fn();
    const { result, rerender } = await renderHookSSR(({ callback }) => usePreservedCallback(callback), {
      initialProps: { callback },
    });

    const firstInstance = result.current;

    // Rerender with the same callback
    rerender({ callback });

    const secondInstance = result.current;

    expect(firstInstance).toBe(secondInstance);
  });
});
