import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useRefEffect } from './useRefEffect.ts';

describe('useRefEffect', () => {
  it('should call the callback when a new element is set', () => {
    const mockCallback = vi.fn();
    const { result } = renderHook(() => useRefEffect(mockCallback, []));

    const mockElement = document.createElement('div');
    result.current(mockElement);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(mockElement);
  });

  it('should call the cleanup function when the element changes', () => {
    const mockCleanup = vi.fn();
    const mockCallback = vi.fn(() => mockCleanup);
    const { result } = renderHook(() => useRefEffect(mockCallback, []));

    const mockElement1 = document.createElement('div');
    result.current(mockElement1);

    const mockElement2 = document.createElement('div');
    result.current(mockElement2);

    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(mockCleanup).toHaveBeenCalledTimes(1);
  });

  it('should not call the callback when setting null', () => {
    const mockCallback = vi.fn();
    const { result } = renderHook(() => useRefEffect(mockCallback, []));

    result.current(null);

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should call the cleanup function when setting null', () => {
    const mockCleanup = vi.fn();
    const mockCallback = vi.fn(() => mockCleanup);
    const { result } = renderHook(() => useRefEffect(mockCallback, []));

    const mockElement = document.createElement('div');
    result.current(mockElement);

    result.current(null);

    expect(mockCleanup).toHaveBeenCalledTimes(1);
  });

  it('should respect dependencies and re-initialize when they change', () => {
    const mockCallback1 = vi.fn();
    const mockCallback2 = vi.fn();
    let callback = mockCallback1;

    const { result, rerender } = renderHook(() => useRefEffect(callback, [callback]));

    const mockElement = document.createElement('div');
    result.current(mockElement);

    expect(mockCallback1).toHaveBeenCalledTimes(1);

    callback = mockCallback2;
    rerender();

    result.current(mockElement);

    expect(mockCallback2).toHaveBeenCalledTimes(1);
  });
});
