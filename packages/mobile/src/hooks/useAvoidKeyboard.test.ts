import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { subscribeKeyboardHeight } from '../utils/keyboard/subscribeKeyboardHeight.ts';

import { useAvoidKeyboard } from './useAvoidKeyboard.ts';

vi.mock('../../utils/keyboardHeight/subscribeKeyboardHeight.ts', () => ({
  subscribeKeyboardHeight: vi.fn(),
}));

const mockSubscribeKeyboardHeight = vi.mocked(subscribeKeyboardHeight);

describe('useAvoidKeyboard', () => {
  let mockUnsubscribe: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockUnsubscribe = vi.fn();
    mockSubscribeKeyboardHeight.mockReturnValue({ unsubscribe: mockUnsubscribe });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return initial state with keyboard hidden', () => {
      const { result } = renderHook(() => useAvoidKeyboard());

      expect(result.current.keyboardHeight).toBe(0);
      expect(result.current.isKeyboardVisible).toBe(false);
      expect(result.current.style).toEqual({
        transform: 'translateY(0px)',
        transition: 'transform 200ms ease-out',
      });
    });
  });

  describe('style generation', () => {
    it('should generate correct transform when keyboard is visible', () => {
      mockSubscribeKeyboardHeight.mockImplementation(({ callback }) => {
        callback(300);
        return { unsubscribe: mockUnsubscribe };
      });

      const { result } = renderHook(() => useAvoidKeyboard());

      expect(result.current.style).toEqual({
        transform: 'translateY(-300px)',
        transition: 'transform 200ms ease-out',
      });
    });

    it('should include baseBottom in transform calculation', () => {
      mockSubscribeKeyboardHeight.mockImplementation(({ callback }) => {
        callback(300);
        return { unsubscribe: mockUnsubscribe };
      });

      const { result } = renderHook(() => useAvoidKeyboard({ baseBottom: 20 }));

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
      mockSubscribeKeyboardHeight.mockImplementation(({ callback }) => {
        callback(250);
        return { unsubscribe: mockUnsubscribe };
      });

      const { result } = renderHook(() =>
        useAvoidKeyboard({
          baseBottom: 30,
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

  describe('keyboard visibility', () => {
    it('should return isKeyboardVisible as true when keyboard height > 0', () => {
      mockSubscribeKeyboardHeight.mockImplementation(({ callback }) => {
        callback(100);
        return { unsubscribe: mockUnsubscribe };
      });

      const { result } = renderHook(() => useAvoidKeyboard());

      expect(result.current.isKeyboardVisible).toBe(true);
    });

    it('should return isKeyboardVisible as false when keyboard height is 0', () => {
      mockSubscribeKeyboardHeight.mockImplementation(({ callback }) => {
        callback(0);
        return { unsubscribe: mockUnsubscribe };
      });

      const { result } = renderHook(() => useAvoidKeyboard());

      expect(result.current.isKeyboardVisible).toBe(false);
    });
  });

  describe('keyboard height updates', () => {
    it('should update style when keyboard height changes', () => {
      let capturedCallback: ((height: number) => void) | null = null;

      mockSubscribeKeyboardHeight.mockImplementation(({ callback }) => {
        capturedCallback = callback;
        return { unsubscribe: mockUnsubscribe };
      });

      const { result } = renderHook(() => useAvoidKeyboard());

      expect(result.current.style.transform).toBe('translateY(0px)');
      expect(result.current.isKeyboardVisible).toBe(false);

      act(() => {
        capturedCallback?.(350);
      });

      expect(result.current.style.transform).toBe('translateY(-350px)');
      expect(result.current.isKeyboardVisible).toBe(true);

      act(() => {
        capturedCallback?.(0);
      });

      expect(result.current.style.transform).toBe('translateY(0px)');
      expect(result.current.isKeyboardVisible).toBe(false);
    });
  });

  describe('immediate option', () => {
    it('should pass immediate: true by default to useKeyboardHeight', () => {
      renderHook(() => useAvoidKeyboard());

      expect(mockSubscribeKeyboardHeight).toHaveBeenCalledWith({
        callback: expect.any(Function),
        immediate: true,
      });
    });

    it('should pass immediate: false when specified', () => {
      renderHook(() => useAvoidKeyboard({ immediate: false }));

      expect(mockSubscribeKeyboardHeight).toHaveBeenCalledWith({
        callback: expect.any(Function),
        immediate: false,
      });
    });
  });

  describe('cleanup behavior', () => {
    it('should clean up subscription on unmount', () => {
      const { unmount } = renderHook(() => useAvoidKeyboard());

      expect(mockUnsubscribe).not.toHaveBeenCalled();

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('use cases', () => {
    it('should provide style for fixed bottom CTA', () => {
      mockSubscribeKeyboardHeight.mockImplementation(({ callback }) => {
        callback(300);
        return { unsubscribe: mockUnsubscribe };
      });

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

    it('should handle safe area with baseBottom', () => {
      mockSubscribeKeyboardHeight.mockImplementation(({ callback }) => {
        callback(300);
        return { unsubscribe: mockUnsubscribe };
      });

      const safeAreaBottom = 34;
      const { result } = renderHook(() => useAvoidKeyboard({ baseBottom: safeAreaBottom }));

      expect(result.current.style.transform).toBe('translateY(-334px)');
    });

    it('should conditionally render based on keyboard visibility', () => {
      let capturedCallback: ((height: number) => void) | null = null;

      mockSubscribeKeyboardHeight.mockImplementation(({ callback }) => {
        capturedCallback = callback;
        return { unsubscribe: mockUnsubscribe };
      });

      const { result } = renderHook(() => useAvoidKeyboard());

      // Initial state: keyboard hidden, show element normally
      expect(result.current.isKeyboardVisible).toBe(false);

      // Keyboard appears
      act(() => {
        capturedCallback?.(300);
      });

      // Element should move up
      expect(result.current.isKeyboardVisible).toBe(true);
      expect(result.current.keyboardHeight).toBe(300);
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
      let capturedCallback: ((height: number) => void) | null = null;

      mockSubscribeKeyboardHeight.mockImplementation(({ callback }) => {
        capturedCallback = callback;
        return { unsubscribe: mockUnsubscribe };
      });

      const { result } = renderHook(() => useAvoidKeyboard());

      const firstStyle = result.current.style;

      act(() => {
        capturedCallback?.(100);
      });

      expect(result.current.style).not.toBe(firstStyle);
    });
  });
});
