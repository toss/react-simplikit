import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useVisualViewport } from './useVisualViewport.ts';

describe('useVisualViewport', () => {
  let mockVisualViewport: {
    width: number;
    height: number;
    offsetLeft: number;
    offsetTop: number;
    scale: number;
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockVisualViewport = {
      width: 375,
      height: 667,
      offsetLeft: 0,
      offsetTop: 0,
      scale: 1,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    Object.defineProperty(window, 'visualViewport', {
      writable: true,
      configurable: true,
      value: mockVisualViewport,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return initial viewport state', () => {
    const { result } = renderHook(() => useVisualViewport());

    expect(result.current.viewport).not.toBeNull();
    expect(result.current.viewport).toEqual({
      width: 375,
      height: 667,
      offsetLeft: 0,
      offsetTop: 0,
      scale: 1,
    });
  });

  it('should register resize and scroll event listeners on mount', () => {
    renderHook(() => useVisualViewport());

    expect(mockVisualViewport.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(mockVisualViewport.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(mockVisualViewport.addEventListener).toHaveBeenCalledTimes(2);
  });

  it('should update viewport state on resize event', async () => {
    const { result } = renderHook(() => useVisualViewport());

    const resizeHandler = mockVisualViewport.addEventListener.mock.calls.find(([event]) => event === 'resize')?.[1];

    // Simulate viewport resize (e.g., keyboard appears)
    mockVisualViewport.height = 400;
    mockVisualViewport.offsetTop = -267;

    await act(async () => {
      resizeHandler?.();
      // Wait for startTransition
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.viewport).not.toBeNull();
    expect(result.current.viewport).toEqual({
      width: 375,
      height: 400,
      offsetLeft: 0,
      offsetTop: -267,
      scale: 1,
    });
  });

  it('should update viewport state on scroll event', async () => {
    const { result } = renderHook(() => useVisualViewport());

    const scrollHandler = mockVisualViewport.addEventListener.mock.calls.find(([event]) => event === 'scroll')?.[1];

    // Simulate viewport scroll
    mockVisualViewport.offsetLeft = 10;
    mockVisualViewport.offsetTop = -50;

    await act(async () => {
      scrollHandler?.();
      // Wait for startTransition
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.viewport).not.toBeNull();
    expect(result.current.viewport).toEqual({
      width: 375,
      height: 667,
      offsetLeft: 10,
      offsetTop: -50,
      scale: 1,
    });
  });

  it('should handle pinch-zoom scale changes', async () => {
    const { result } = renderHook(() => useVisualViewport());

    const resizeHandler = mockVisualViewport.addEventListener.mock.calls.find(([event]) => event === 'resize')?.[1];

    // Simulate pinch-zoom
    mockVisualViewport.scale = 2.0;
    mockVisualViewport.width = 187; // Width halves when scale doubles
    mockVisualViewport.height = 333;

    await act(async () => {
      resizeHandler?.();
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.viewport).not.toBeNull();
    expect(result.current.viewport?.scale).toBe(2.0);
    expect(result.current.viewport?.width).toBe(187);
    expect(result.current.viewport?.height).toBe(333);
  });

  it('should remove event listeners on unmount', () => {
    const { unmount } = renderHook(() => useVisualViewport());

    unmount();

    expect(mockVisualViewport.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(mockVisualViewport.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(mockVisualViewport.removeEventListener).toHaveBeenCalledTimes(2);
  });

  it('should handle missing visualViewport gracefully', () => {
    Object.defineProperty(window, 'visualViewport', {
      writable: true,
      configurable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useVisualViewport());

    expect(result.current.viewport).toBeNull();
  });

  it('should handle null visualViewport', () => {
    Object.defineProperty(window, 'visualViewport', {
      writable: true,
      configurable: true,
      value: null,
    });

    const { result } = renderHook(() => useVisualViewport());

    expect(result.current.viewport).toBeNull();
  });

  it('should handle multiple rapid updates correctly', async () => {
    const { result } = renderHook(() => useVisualViewport());

    const resizeHandler = mockVisualViewport.addEventListener.mock.calls.find(([event]) => event === 'resize')?.[1];

    // Simulate multiple rapid viewport changes (e.g., keyboard animation)
    await act(async () => {
      mockVisualViewport.height = 600;
      resizeHandler?.();
      mockVisualViewport.height = 500;
      resizeHandler?.();
      mockVisualViewport.height = 400;
      resizeHandler?.();
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Should reflect the last update
    expect(result.current.viewport).not.toBeNull();
    expect(result.current.viewport?.height).toBe(400);
  });

  it('should handle edge case with zero dimensions', async () => {
    const { result } = renderHook(() => useVisualViewport());

    const resizeHandler = mockVisualViewport.addEventListener.mock.calls.find(([event]) => event === 'resize')?.[1];

    mockVisualViewport.width = 0;
    mockVisualViewport.height = 0;

    await act(async () => {
      resizeHandler?.();
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.viewport).not.toBeNull();
    expect(result.current.viewport).toEqual({
      width: 0,
      height: 0,
      offsetLeft: 0,
      offsetTop: 0,
      scale: 1,
    });
  });

  it('should handle negative offsetTop (iOS keyboard)', async () => {
    const { result } = renderHook(() => useVisualViewport());

    const resizeHandler = mockVisualViewport.addEventListener.mock.calls.find(([event]) => event === 'resize')?.[1];

    // iOS keyboard scenario
    mockVisualViewport.offsetTop = -300;
    mockVisualViewport.height = 367; // 667 - 300

    await act(async () => {
      resizeHandler?.();
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.viewport).not.toBeNull();
    expect(result.current.viewport?.offsetTop).toBe(-300);
    expect(result.current.viewport?.height).toBe(367);
  });

  it('should handle zoom out scenario (scale < 1)', async () => {
    const { result } = renderHook(() => useVisualViewport());

    const resizeHandler = mockVisualViewport.addEventListener.mock.calls.find(([event]) => event === 'resize')?.[1];

    // Zoom out (rare, but possible with certain viewport settings)
    mockVisualViewport.scale = 0.5;
    mockVisualViewport.width = 750;
    mockVisualViewport.height = 1334;

    await act(async () => {
      resizeHandler?.();
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.viewport).not.toBeNull();
    expect(result.current.viewport?.scale).toBe(0.5);
    expect(result.current.viewport?.width).toBe(750);
  });
});
