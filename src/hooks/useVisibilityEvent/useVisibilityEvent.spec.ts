import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useVisibilityEvent } from './useVisibilityEvent.ts';

describe('useVisibilityEvent', () => {
  it('calls the callback when visibility changes', () => {
    const mockCallback = vi.fn();

    renderHook(() => useVisibilityEvent(mockCallback));

    act(() => simulateVisibilityChange('hidden'));

    expect(mockCallback).toHaveBeenCalledWith('hidden');

    act(() => simulateVisibilityChange('visible'));

    expect(mockCallback).toHaveBeenCalledWith('visible');
  });

  it('does not call the callback on initial render if immediate is false', () => {
    const mockCallback = vi.fn();

    renderHook(() => useVisibilityEvent(mockCallback, { immediate: false }));

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('calls the callback immediately on initial render if immediate is true', () => {
    const mockCallback = vi.fn();

    act(() => simulateVisibilityChange('visible'));

    renderHook(() => useVisibilityEvent(mockCallback, { immediate: true }));

    expect(mockCallback).toHaveBeenCalledWith('visible');
  });

  it('removes the event listener on unmount', () => {
    const mockCallback = vi.fn();

    const { unmount } = renderHook(() => useVisibilityEvent(mockCallback));

    unmount();

    act(() => simulateVisibilityChange('hidden'));

    expect(mockCallback).not.toHaveBeenCalled();
  });
});

function simulateVisibilityChange(visibilityState: 'visible' | 'hidden') {
  Object.defineProperty(document, 'visibilityState', { value: visibilityState, writable: true });

  document.dispatchEvent(new Event('visibilitychange'));
}
