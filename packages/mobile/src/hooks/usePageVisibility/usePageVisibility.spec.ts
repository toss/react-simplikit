import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../test/renderHookSSR.tsx';

import { usePageVisibility } from './usePageVisibility.ts';

describe('usePageVisibility', () => {
  it('is safe on server side rendering', () => {
    const result = renderHookSSR.serverOnly(() => usePageVisibility());

    expect(result.current).toEqual({
      isVisible: true,
      visibilityState: 'visible',
    });
  });

  describe('browser environment', () => {
    let visibilityState: 'visible' | 'hidden';

    const setVisibilityState = (state: 'visible' | 'hidden') => {
      visibilityState = state;
      document.dispatchEvent(new Event('visibilitychange'));
    };

    beforeEach(() => {
      visibilityState = 'visible';

      Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        get() {
          return visibilityState;
        },
      });
    });

    it('should return initial visibility state (visible)', () => {
      const { result } = renderHook(() => usePageVisibility());

      expect(result.current).toEqual({
        isVisible: true,
        visibilityState: 'visible',
      });
    });

    it('should return initial visibility state (hidden)', () => {
      visibilityState = 'hidden';

      const { result } = renderHook(() => usePageVisibility());

      expect(result.current).toEqual({
        isVisible: false,
        visibilityState: 'hidden',
      });
    });

    it('should register visibilitychange event listener on mount', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

      renderHook(() => usePageVisibility());

      expect(addEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));

      addEventListenerSpy.mockRestore();
    });

    it('should update state when page becomes hidden', () => {
      const { result } = renderHook(() => usePageVisibility());

      expect(result.current.isVisible).toBe(true);

      act(() => {
        setVisibilityState('hidden');
      });

      expect(result.current).toEqual({
        isVisible: false,
        visibilityState: 'hidden',
      });
    });

    it('should update state when page becomes visible', () => {
      visibilityState = 'hidden';

      const { result } = renderHook(() => usePageVisibility());

      expect(result.current.isVisible).toBe(false);

      act(() => {
        setVisibilityState('visible');
      });

      expect(result.current).toEqual({
        isVisible: true,
        visibilityState: 'visible',
      });
    });

    it('should remove event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { unmount } = renderHook(() => usePageVisibility());

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));

      removeEventListenerSpy.mockRestore();
    });

    it('should handle multiple rapid visibility changes', () => {
      const { result } = renderHook(() => usePageVisibility());

      act(() => {
        setVisibilityState('hidden');
        setVisibilityState('visible');
        setVisibilityState('hidden');
      });

      expect(result.current).toEqual({
        isVisible: false,
        visibilityState: 'hidden',
      });
    });

    it('should handle multiple hook instances independently', () => {
      const { result: result1 } = renderHook(() => usePageVisibility());
      const { result: result2 } = renderHook(() => usePageVisibility());

      expect(result1.current).toEqual(result2.current);

      act(() => {
        setVisibilityState('hidden');
      });

      expect(result1.current).toEqual(result2.current);
      expect(result1.current.isVisible).toBe(false);
    });
  });
});
