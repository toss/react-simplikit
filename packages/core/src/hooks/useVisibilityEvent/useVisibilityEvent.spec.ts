import { act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useVisibilityEvent } from './useVisibilityEvent.ts';

describe('useVisibilityEvent', () => {
  it('calls the callback when visibility changes', async () => {
    const mockCallback = vi.fn();

    await renderHookSSR(() => useVisibilityEvent(mockCallback));

    await act(async () => simulateVisibilityChange('hidden'));

    expect(mockCallback).toHaveBeenCalledWith('hidden');

    await act(async () => simulateVisibilityChange('visible'));

    expect(mockCallback).toHaveBeenCalledWith('visible');
  });

  it('is safe on server side rendering', () => {
    const callback = vi.fn();
    renderHookSSR.serverOnly(() => useVisibilityEvent(callback));

    expect(callback).not.toHaveBeenCalled();
  });

  it('should not call the callback on initial render if immediate is false', async () => {
    const mockCallback = vi.fn();

    await renderHookSSR(() => useVisibilityEvent(mockCallback, { immediate: false }));

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should call the callback immediately on initial render if immediate is true', async () => {
    const mockCallback = vi.fn();

    await act(async () => simulateVisibilityChange('visible'));

    await renderHookSSR(() => useVisibilityEvent(mockCallback, { immediate: true }));

    expect(mockCallback).toHaveBeenCalledWith('visible');
  });

  it('should remove the event listener on unmount', async () => {
    const mockCallback = vi.fn();

    const { unmount } = await renderHookSSR(() => useVisibilityEvent(mockCallback));

    unmount();

    await act(async () => simulateVisibilityChange('hidden'));

    expect(mockCallback).not.toHaveBeenCalled();
  });
});

function simulateVisibilityChange(visibilityState: 'visible' | 'hidden') {
  Object.defineProperty(document, 'visibilityState', { value: visibilityState, writable: true });

  document.dispatchEvent(new Event('visibilitychange'));
}
