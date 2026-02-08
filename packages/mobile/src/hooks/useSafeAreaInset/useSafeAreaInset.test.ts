import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useSafeAreaInset } from './useSafeAreaInset.ts';

describe('useSafeAreaInset', () => {
  let mockGetComputedStyle: ReturnType<typeof vi.fn>;
  let createdElements: HTMLElement[] = [];

  beforeEach(() => {
    createdElements = [];

    // Mock document.createElement
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const element = originalCreateElement(tagName);
      if (tagName === 'div') {
        createdElements.push(element);
      }
      return element;
    });

    // Mock document.body.appendChild and removeChild
    vi.spyOn(document.body, 'appendChild').mockImplementation(node => node as HTMLElement);
    vi.spyOn(document.body, 'removeChild').mockImplementation(node => node as HTMLElement);

    // Mock getComputedStyle
    mockGetComputedStyle = vi.fn().mockReturnValue({
      getPropertyValue: (prop: string) => {
        if (prop === 'padding-top') return '47px';
        if (prop === 'padding-bottom') return '34px';
        if (prop === 'padding-left') return '0px';
        if (prop === 'padding-right') return '0px';
        return '0px';
      },
    });
    vi.spyOn(window, 'getComputedStyle').mockImplementation(mockGetComputedStyle);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    createdElements = [];
  });

  it('should return initial safe area inset values', () => {
    const { result } = renderHook(() => useSafeAreaInset());

    expect(result.current).toEqual({
      top: 47,
      bottom: 34,
      left: 0,
      right: 0,
    });
  });

  it('should register resize and orientationchange event listeners on mount', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

    renderHook(() => useSafeAreaInset());

    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('orientationchange', expect.any(Function));
  });

  it('should update inset values on resize event (orientation change)', async () => {
    const { result } = renderHook(() => useSafeAreaInset());

    // Simulate orientation change - landscape mode
    mockGetComputedStyle.mockReturnValue({
      getPropertyValue: (prop: string) => {
        if (prop === 'padding-top') return '0px';
        if (prop === 'padding-bottom') return '21px';
        if (prop === 'padding-left') return '47px';
        if (prop === 'padding-right') return '47px';
        return '0px';
      },
    });

    await act(async () => {
      window.dispatchEvent(new Event('resize'));
      // Wait for startTransition
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current).toEqual({
      top: 0,
      bottom: 21,
      left: 47,
      right: 47,
    });
  });

  it('should update inset values on orientationchange event', async () => {
    const { result } = renderHook(() => useSafeAreaInset());

    // Simulate orientation change
    mockGetComputedStyle.mockReturnValue({
      getPropertyValue: (prop: string) => {
        if (prop === 'padding-top') return '0px';
        if (prop === 'padding-bottom') return '21px';
        if (prop === 'padding-left') return '44px';
        if (prop === 'padding-right') return '44px';
        return '0px';
      },
    });

    await act(async () => {
      window.dispatchEvent(new Event('orientationchange'));
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current).toEqual({
      top: 0,
      bottom: 21,
      left: 44,
      right: 44,
    });
  });

  it('should remove event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useSafeAreaInset());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('orientationchange', expect.any(Function));
  });

  it('should handle multiple rapid updates correctly', async () => {
    const { result } = renderHook(() => useSafeAreaInset());

    await act(async () => {
      // First update
      mockGetComputedStyle.mockReturnValue({
        getPropertyValue: () => '10px',
      });
      window.dispatchEvent(new Event('resize'));

      // Second update
      mockGetComputedStyle.mockReturnValue({
        getPropertyValue: () => '20px',
      });
      window.dispatchEvent(new Event('resize'));

      // Third update (final)
      mockGetComputedStyle.mockReturnValue({
        getPropertyValue: () => '30px',
      });
      window.dispatchEvent(new Event('resize'));

      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Should reflect the last update
    expect(result.current).toEqual({
      top: 30,
      bottom: 30,
      left: 30,
      right: 30,
    });
  });

  it('should handle zero insets (desktop browser)', () => {
    mockGetComputedStyle.mockReturnValue({
      getPropertyValue: () => '0px',
    });

    const { result } = renderHook(() => useSafeAreaInset());

    expect(result.current).toEqual({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    });
  });

  it('should handle empty string values gracefully', () => {
    mockGetComputedStyle.mockReturnValue({
      getPropertyValue: () => '',
    });

    const { result } = renderHook(() => useSafeAreaInset());

    expect(result.current).toEqual({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    });
  });

  it('should handle typical iPhone with Face ID values', () => {
    mockGetComputedStyle.mockReturnValue({
      getPropertyValue: (prop: string) => {
        if (prop === 'padding-top') return '59px'; // Dynamic Island
        if (prop === 'padding-bottom') return '34px'; // Home indicator
        if (prop === 'padding-left') return '0px';
        if (prop === 'padding-right') return '0px';
        return '0px';
      },
    });

    const { result } = renderHook(() => useSafeAreaInset());

    expect(result.current).toEqual({
      top: 59,
      bottom: 34,
      left: 0,
      right: 0,
    });
  });

  it('should handle landscape mode with side insets', async () => {
    const { result } = renderHook(() => useSafeAreaInset());

    // Simulate landscape orientation
    mockGetComputedStyle.mockReturnValue({
      getPropertyValue: (prop: string) => {
        if (prop === 'padding-top') return '0px';
        if (prop === 'padding-bottom') return '21px';
        if (prop === 'padding-left') return '59px'; // Notch on left in landscape
        if (prop === 'padding-right') return '0px';
        return '0px';
      },
    });

    await act(async () => {
      window.dispatchEvent(new Event('resize'));
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current).toEqual({
      top: 0,
      bottom: 21,
      left: 59,
      right: 0,
    });
  });

  it('should handle float values', () => {
    mockGetComputedStyle.mockReturnValue({
      getPropertyValue: (prop: string) => {
        if (prop === 'padding-top') return '47.5px';
        if (prop === 'padding-bottom') return '34.25px';
        return '0px';
      },
    });

    const { result } = renderHook(() => useSafeAreaInset());

    expect(result.current.top).toBe(47.5);
    expect(result.current.bottom).toBe(34.25);
  });

  it('should re-render when hook is called again after unmount and remount', async () => {
    const { result, unmount } = renderHook(() => useSafeAreaInset());

    expect(result.current.top).toBe(47);

    unmount();

    // Change values
    mockGetComputedStyle.mockReturnValue({
      getPropertyValue: () => '100px',
    });

    // Remount
    const { result: newResult } = renderHook(() => useSafeAreaInset());

    expect(newResult.current).toEqual({
      top: 100,
      bottom: 100,
      left: 100,
      right: 100,
    });
  });
});
