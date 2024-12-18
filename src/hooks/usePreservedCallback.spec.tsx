import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { usePreservedCallback } from './usePreservedCallback.ts';

describe('usePreservedCallback', () => {
  it('should preserve the callback reference', () => {
    const initialCallback = vi.fn();
    const updatedCallback = vi.fn();

    const { result, rerender } = renderHook(({ callback }) => usePreservedCallback(callback), {
      initialProps: { callback: initialCallback },
    });

    // Call the preserved callback
    result.current();

    // Assert the initial callback is called
    expect(initialCallback).toHaveBeenCalledTimes(1);
    expect(updatedCallback).not.toHaveBeenCalled();

    // Update the callback
    rerender({ callback: updatedCallback });

    // Call the preserved callback again
    result.current();

    // Assert the updated callback is called
    expect(updatedCallback).toHaveBeenCalledTimes(1);
    expect(initialCallback).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments to the callback', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => usePreservedCallback(callback));

    // Call the preserved callback with arguments
    result.current('arg1', 'arg2');

    // Assert the callback is called with the correct arguments
    expect(callback).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should handle multiple calls to the preserved callback', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => usePreservedCallback(callback));

    // Call the preserved callback multiple times
    result.current('call1');
    result.current('call2');

    // Assert the callback is called the correct number of times
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith('call1');
    expect(callback).toHaveBeenCalledWith('call2');
  });
});
