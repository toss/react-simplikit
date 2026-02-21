import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../../test/renderHookSSR.tsx';

import { useNetworkStatus } from './useNetworkStatus.ts';

describe('useNetworkStatus', () => {
  it('is safe on server side rendering', () => {
    const result = renderHookSSR.serverOnly(() => useNetworkStatus());

    expect(result.current).toEqual({});
  });

  describe('browser environment', () => {
    let mockConnection: {
      effectiveType?: '4g' | '3g' | '2g' | 'slow-2g';
      type?: 'bluetooth' | 'cellular' | 'ethernet' | 'mixed' | 'none' | 'other' | 'unknown' | 'wifi' | 'wimax';
      downlink?: number;
      rtt?: number;
      saveData?: boolean;
      addEventListener: ReturnType<typeof vi.fn>;
      removeEventListener: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
      mockConnection = {
        effectiveType: '4g',
        type: 'wifi',
        downlink: 10,
        rtt: 50,
        saveData: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      Object.defineProperty(navigator, 'connection', {
        writable: true,
        configurable: true,
        value: mockConnection,
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should return network status from connection API', () => {
      const { result } = renderHook(() => useNetworkStatus());

      expect(result.current).toEqual({
        effectiveType: '4g',
        type: 'wifi',
        downlink: 10,
        rtt: 50,
        saveData: false,
      });
    });

    it('should return different effective types', () => {
      mockConnection.effectiveType = '3g';

      const { result } = renderHook(() => useNetworkStatus());

      expect(result.current.effectiveType).toBe('3g');
    });

    it('should return saveData preference', () => {
      mockConnection.saveData = true;

      const { result } = renderHook(() => useNetworkStatus());

      expect(result.current.saveData).toBe(true);
    });

    it('should register change event listener on mount', () => {
      renderHook(() => useNetworkStatus());

      expect(mockConnection.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
      expect(mockConnection.addEventListener).toHaveBeenCalledTimes(1);
    });

    it('should update network status on change event', () => {
      const { result } = renderHook(() => useNetworkStatus());

      const changeHandler = mockConnection.addEventListener.mock.calls[0][1];

      mockConnection.effectiveType = '3g';
      mockConnection.downlink = 1;

      act(() => {
        changeHandler();
      });

      expect(result.current.effectiveType).toBe('3g');
      expect(result.current.downlink).toBe(1);
    });

    it('should remove event listener on unmount', () => {
      const { unmount } = renderHook(() => useNetworkStatus());

      unmount();

      expect(mockConnection.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
      expect(mockConnection.removeEventListener).toHaveBeenCalledTimes(1);
    });

    it('should return empty object when connection API is not supported', () => {
      Object.defineProperty(navigator, 'connection', {
        writable: true,
        configurable: true,
        value: undefined,
      });

      const { result } = renderHook(() => useNetworkStatus());

      expect(result.current).toEqual({});
    });

    it('should handle undefined values gracefully', () => {
      mockConnection.effectiveType = undefined;
      mockConnection.type = undefined;
      mockConnection.downlink = undefined;
      mockConnection.rtt = undefined;
      mockConnection.saveData = undefined;

      const { result } = renderHook(() => useNetworkStatus());

      expect(result.current).toEqual({
        effectiveType: undefined,
        type: undefined,
        downlink: undefined,
        rtt: undefined,
        saveData: undefined,
      });
    });

    it('should handle multiple rapid connection changes', () => {
      const { result } = renderHook(() => useNetworkStatus());

      const changeHandler = mockConnection.addEventListener.mock.calls[0][1];

      act(() => {
        mockConnection.effectiveType = '3g';
        changeHandler();
        mockConnection.effectiveType = '2g';
        changeHandler();
        mockConnection.effectiveType = '4g';
        changeHandler();
      });

      expect(result.current.effectiveType).toBe('4g');
    });
  });
});
