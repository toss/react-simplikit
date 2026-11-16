import { useState } from 'react';
import { act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { usePageVisibilityEffect } from './usePageVisibilityEffect.ts';
import { useVisibilityEvent } from './useVisibilityEvent.ts';

describe('usePageVisibilityEffect', () => {
  it('calls the callback when visibility changes', async () => {
    const mockCallback = vi.fn();

    await renderHookSSR(() => usePageVisibilityEffect(mockCallback));

    await act(async () => simulateVisibilityChange('hidden'));

    expect(mockCallback).toHaveBeenCalledWith('hidden');

    await act(async () => simulateVisibilityChange('visible'));

    expect(mockCallback).toHaveBeenCalledWith('visible');
  });

  it('is safe on server side rendering', () => {
    const callback = vi.fn();
    renderHookSSR.serverOnly(() => usePageVisibilityEffect(callback));

    expect(callback).not.toHaveBeenCalled();
  });

  it('should not call the callback on initial render if immediate is false', async () => {
    const mockCallback = vi.fn();

    await renderHookSSR(() => usePageVisibilityEffect(mockCallback, { immediate: false }));

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should call the callback immediately on initial render if immediate is true', async () => {
    const mockCallback = vi.fn();

    await act(async () => simulateVisibilityChange('visible'));

    await renderHookSSR(() => usePageVisibilityEffect(mockCallback, { immediate: true }));

    expect(mockCallback).toHaveBeenCalledWith('visible');
  });

  it('should keep the same listener when the callback changes between renders', async () => {
    const addEventListener = vi.spyOn(document, 'addEventListener');
    const removeEventListener = vi.spyOn(document, 'removeEventListener');
    const calls: Array<['visible' | 'hidden', number]> = [];

    const { rerender } = await renderHookSSR(
      ({ version }: { version: number }) =>
        usePageVisibilityEffect(visibilityState => {
          calls.push([visibilityState, version]);
        }),
      { initialProps: { version: 1 } }
    );

    const countVisibilityListeners = (spy: typeof addEventListener) =>
      spy.mock.calls.filter(([type]) => type === 'visibilitychange').length;

    const addedAfterMount = countVisibilityListeners(addEventListener);

    rerender({ version: 2 });
    rerender({ version: 3 });

    expect(countVisibilityListeners(addEventListener)).toBe(addedAfterMount);
    expect(countVisibilityListeners(removeEventListener)).toBe(0);

    await act(async () => simulateVisibilityChange('hidden'));

    expect(calls).toEqual([['hidden', 3]]);

    addEventListener.mockRestore();
    removeEventListener.mockRestore();
  });

  it('should not re-run an immediate callback that updates state on every render', async () => {
    let renderCount = 0;

    const { result } = await renderHookSSR(() => {
      renderCount += 1;
      if (renderCount > 10) {
        throw new Error('usePageVisibilityEffect re-ran the immediate callback on every render');
      }
      const [log, setLog] = useState<Array<'visible' | 'hidden'>>([]);

      usePageVisibilityEffect(visibilityState => setLog(prev => [...prev, visibilityState]), { immediate: true });

      return log;
    });

    expect(result.current).toEqual([document.visibilityState]);
    expect(renderCount).toBeLessThanOrEqual(3);
  });

  it('should remove the event listener on unmount', async () => {
    const mockCallback = vi.fn();

    const { unmount } = await renderHookSSR(() => usePageVisibilityEffect(mockCallback));

    unmount();

    await act(async () => simulateVisibilityChange('hidden'));

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('keeps the deprecated useVisibilityEvent as the same function', () => {
    expect(useVisibilityEvent).toBe(usePageVisibilityEffect);
  });
});

function simulateVisibilityChange(visibilityState: 'visible' | 'hidden') {
  Object.defineProperty(document, 'visibilityState', { value: visibilityState, writable: true });

  document.dispatchEvent(new Event('visibilitychange'));
}
