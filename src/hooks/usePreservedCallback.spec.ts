import { act, renderHook } from '@testing-library/react';

import { usePreservedCallback } from './usePreservedCallback.ts';

describe('usePreservedCallback', () => {
  test('should return the same callback instance initially', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => usePreservedCallback(callback));

    const preservedCallback = result.current;

    expect(typeof preservedCallback).toBe('function');
    preservedCallback();
    expect(callback).toHaveBeenCalled();
  });

  test('should always call the latest version of the callback', () => {
    const initialCallback = vi.fn();
    const updatedCallback = vi.fn();

    const { result, rerender } = renderHook(({ callback }) => usePreservedCallback(callback), {
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

  test('should correctly pass arguments to the callback', () => {
    const callback = vi.fn((a: number, b: number) => a + b);
    const { result } = renderHook(() => usePreservedCallback(callback));

    act(() => {
      result.current(2, 3);
    });

    expect(callback).toHaveBeenCalledWith(2, 3);
    expect(callback).toHaveReturnedWith(5);
  });

  test('should not create a new function instance unnecessarily', () => {
    const callback = vi.fn();
    const { result, rerender } = renderHook(({ callback }) => usePreservedCallback(callback), {
      initialProps: { callback },
    });

    const firstInstance = result.current;

    // Rerender with the same callback
    rerender({ callback });

    const secondInstance = result.current;

    expect(firstInstance).toBe(secondInstance);
  });
});
