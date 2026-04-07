import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { subscribeKeyboardHeight } from '../../utils/subscribeKeyboardHeight/index.ts';

import { useKeyboardHeight } from './useKeyboardHeight.ts';

vi.mock('../../utils/subscribeKeyboardHeight/index.ts', () => ({
  subscribeKeyboardHeight: vi.fn(),
}));

const mockSubscribeKeyboardHeight = vi.mocked(subscribeKeyboardHeight);

describe('useKeyboardHeight', () => {
  let mockUnsubscribe: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockUnsubscribe = vi.fn();
    mockSubscribeKeyboardHeight.mockReturnValue({ unsubscribe: mockUnsubscribe });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return 0 as initial keyboard height', () => {
      const { result } = renderHook(() => useKeyboardHeight());

      expect(result.current.keyboardHeight).toBe(0);
    });
  });

  describe('subscription behavior', () => {
    it('should call subscribeKeyboardHeight with immediate: true by default', () => {
      renderHook(() => useKeyboardHeight());

      expect(mockSubscribeKeyboardHeight).toHaveBeenCalledWith({
        callback: expect.any(Function),
        immediate: true,
      });
    });

    it('should call subscribeKeyboardHeight with immediate: false when specified', () => {
      renderHook(() => useKeyboardHeight({ immediate: false }));

      expect(mockSubscribeKeyboardHeight).toHaveBeenCalledWith({
        callback: expect.any(Function),
        immediate: false,
      });
    });

    it('should update keyboard height when callback is invoked', () => {
      mockSubscribeKeyboardHeight.mockImplementation(({ callback }) => {
        callback(300);
        return { unsubscribe: mockUnsubscribe };
      });

      const { result } = renderHook(() => useKeyboardHeight());

      expect(result.current.keyboardHeight).toBe(300);
    });
  });

  describe('cleanup behavior', () => {
    it('should call unsubscribe on unmount', () => {
      const { unmount } = renderHook(() => useKeyboardHeight());

      expect(mockUnsubscribe).not.toHaveBeenCalled();

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    });

    it('should resubscribe when immediate option changes', () => {
      const { rerender } = renderHook(({ immediate }) => useKeyboardHeight({ immediate }), {
        initialProps: { immediate: true },
      });

      expect(mockSubscribeKeyboardHeight).toHaveBeenCalledTimes(1);

      rerender({ immediate: false });

      expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
      expect(mockSubscribeKeyboardHeight).toHaveBeenCalledTimes(2);
    });
  });

  describe('keyboard height updates', () => {
    it('should track keyboard height changes', async () => {
      let capturedCallback: ((height: number) => void) | null = null;

      mockSubscribeKeyboardHeight.mockImplementation(({ callback }) => {
        capturedCallback = callback;
        return { unsubscribe: mockUnsubscribe };
      });

      const { result } = renderHook(() => useKeyboardHeight());

      expect(result.current.keyboardHeight).toBe(0);

      await act(async () => {
        capturedCallback?.(250);
      });

      expect(result.current.keyboardHeight).toBe(250);

      await act(async () => {
        capturedCallback?.(0);
      });

      expect(result.current.keyboardHeight).toBe(0);
    });

    it('should handle various keyboard heights', () => {
      const heights = [0, 100, 250, 350, 500];

      for (const expectedHeight of heights) {
        mockSubscribeKeyboardHeight.mockImplementation(({ callback }) => {
          callback(expectedHeight);
          return { unsubscribe: mockUnsubscribe };
        });

        const { result } = renderHook(() => useKeyboardHeight());

        expect(result.current.keyboardHeight).toBe(expectedHeight);
      }
    });
  });

  describe('use cases', () => {
    it('should provide keyboard height for bottom padding adjustment', () => {
      mockSubscribeKeyboardHeight.mockImplementation(({ callback }) => {
        callback(300);
        return { unsubscribe: mockUnsubscribe };
      });

      const { result } = renderHook(() => useKeyboardHeight());

      const paddingBottom = `${result.current.keyboardHeight}px`;
      expect(paddingBottom).toBe('300px');
    });

    it('should detect keyboard visibility', () => {
      mockSubscribeKeyboardHeight.mockImplementation(({ callback }) => {
        callback(300);
        return { unsubscribe: mockUnsubscribe };
      });

      const { result } = renderHook(() => useKeyboardHeight());

      const isKeyboardVisible = result.current.keyboardHeight > 0;
      expect(isKeyboardVisible).toBe(true);
    });

    it('should detect keyboard hidden state', () => {
      mockSubscribeKeyboardHeight.mockImplementation(({ callback }) => {
        callback(0);
        return { unsubscribe: mockUnsubscribe };
      });

      const { result } = renderHook(() => useKeyboardHeight());

      const isKeyboardVisible = result.current.keyboardHeight > 0;
      expect(isKeyboardVisible).toBe(false);
    });
  });

  describe('multiple instances', () => {
    it('should allow multiple independent hook instances', async () => {
      let callback1: ((height: number) => void) | null = null;
      let callback2: ((height: number) => void) | null = null;

      mockSubscribeKeyboardHeight
        .mockImplementationOnce(({ callback }) => {
          callback1 = callback;
          return { unsubscribe: mockUnsubscribe };
        })
        .mockImplementationOnce(({ callback }) => {
          callback2 = callback;
          return { unsubscribe: mockUnsubscribe };
        });

      const { result: result1 } = renderHook(() => useKeyboardHeight());
      const { result: result2 } = renderHook(() => useKeyboardHeight());

      await act(async () => {
        callback1?.(200);
        callback2?.(200);
      });

      expect(result1.current.keyboardHeight).toBe(200);
      expect(result2.current.keyboardHeight).toBe(200);
    });
  });
});
