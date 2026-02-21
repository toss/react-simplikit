import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useAvoidKeyboard } from './useAvoidKeyboard.ts';

// Mock useKeyboardHeight hook
vi.mock('../keyboardHeight/useKeyboardHeight.ts', () => ({
  useKeyboardHeight: vi.fn(() => ({ keyboardHeight: 0 })),
}));

// Get reference to the mocked function
import { useKeyboardHeight } from '../keyboardHeight/useKeyboardHeight.ts';
const mockUseKeyboardHeight = vi.mocked(useKeyboardHeight);

describe('useAvoidKeyboard', () => {
  beforeEach(() => {
    mockUseKeyboardHeight.mockReturnValue({ keyboardHeight: 0 });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return initial style with keyboard hidden', () => {
      const { result } = renderHook(() => useAvoidKeyboard());

      expect(result.current.style).toEqual({
        transform: 'translateY(0px)',
        transition: 'transform 200ms ease-out',
      });
    });
  });

  describe('style generation', () => {
    it('should generate correct transform when keyboard is visible', () => {
      mockUseKeyboardHeight.mockReturnValue({ keyboardHeight: 300 });

      const { result } = renderHook(() => useAvoidKeyboard());

      expect(result.current.style).toEqual({
        transform: 'translateY(-300px)',
        transition: 'transform 200ms ease-out',
      });
    });

    it('should include safeAreaBottom in transform calculation', () => {
      mockUseKeyboardHeight.mockReturnValue({ keyboardHeight: 300 });

      const { result } = renderHook(() => useAvoidKeyboard({ safeAreaBottom: 20 }));

      expect(result.current.style).toEqual({
        transform: 'translateY(-320px)',
        transition: 'transform 200ms ease-out',
      });
    });

    it('should apply custom transition duration', () => {
      const { result } = renderHook(() => useAvoidKeyboard({ transitionDuration: 300 }));

      expect(result.current.style.transition).toBe('transform 300ms ease-out');
    });

    it('should apply custom transition timing function', () => {
      const { result } = renderHook(() =>
        useAvoidKeyboard({ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' })
      );

      expect(result.current.style.transition).toBe('transform 200ms cubic-bezier(0.4, 0, 0.2, 1)');
    });

    it('should apply all custom options together', () => {
      mockUseKeyboardHeight.mockReturnValue({ keyboardHeight: 250 });

      const { result } = renderHook(() =>
        useAvoidKeyboard({
          safeAreaBottom: 30,
          transitionDuration: 150,
          transitionTimingFunction: 'linear',
        })
      );

      expect(result.current.style).toEqual({
        transform: 'translateY(-280px)',
        transition: 'transform 150ms linear',
      });
    });
  });

  describe('keyboard height updates', () => {
    it('should update style when keyboard height changes', () => {
      const { result, rerender } = renderHook(() => useAvoidKeyboard());

      expect(result.current.style.transform).toBe('translateY(0px)');

      mockUseKeyboardHeight.mockReturnValue({ keyboardHeight: 350 });
      rerender();

      expect(result.current.style.transform).toBe('translateY(-350px)');

      mockUseKeyboardHeight.mockReturnValue({ keyboardHeight: 0 });
      rerender();

      expect(result.current.style.transform).toBe('translateY(0px)');
    });
  });

  describe('immediate option', () => {
    it('should pass immediate: true by default to useKeyboardHeight', () => {
      renderHook(() => useAvoidKeyboard());

      expect(mockUseKeyboardHeight).toHaveBeenCalledWith({ immediate: true });
    });

    it('should pass immediate: false when specified', () => {
      renderHook(() => useAvoidKeyboard({ immediate: false }));

      expect(mockUseKeyboardHeight).toHaveBeenCalledWith({ immediate: false });
    });
  });

  describe('use cases', () => {
    it('should provide style for fixed bottom CTA', () => {
      mockUseKeyboardHeight.mockReturnValue({ keyboardHeight: 300 });

      const { result } = renderHook(() => useAvoidKeyboard());

      const elementStyle = {
        position: 'fixed' as const,
        bottom: 0,
        left: 0,
        right: 0,
        ...result.current.style,
      };

      expect(elementStyle.transform).toBe('translateY(-300px)');
      expect(elementStyle.transition).toBe('transform 200ms ease-out');
    });

    it('should handle safe area with safeAreaBottom', () => {
      mockUseKeyboardHeight.mockReturnValue({ keyboardHeight: 300 });

      const { result } = renderHook(() => useAvoidKeyboard({ safeAreaBottom: 34 }));

      expect(result.current.style.transform).toBe('translateY(-334px)');
    });
  });

  describe('style memoization', () => {
    it('should return same style object when values do not change', () => {
      const { result, rerender } = renderHook(() => useAvoidKeyboard());

      const firstStyle = result.current.style;

      rerender();

      expect(result.current.style).toBe(firstStyle);
    });

    it('should return new style object when keyboard height changes', () => {
      const { result, rerender } = renderHook(() => useAvoidKeyboard());

      const firstStyle = result.current.style;

      mockUseKeyboardHeight.mockReturnValue({ keyboardHeight: 100 });
      rerender();

      expect(result.current.style).not.toBe(firstStyle);
    });
  });
});
