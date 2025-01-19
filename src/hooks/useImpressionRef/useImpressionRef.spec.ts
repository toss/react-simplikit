import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useImpressionRef, UseImpressionRefOptions } from './useImpressionRef.legacy.ts';

const mockInstances: any[] = [];

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();

  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit
  ) {
    mockInstances.push(this);
  }
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

describe('useImpressionRef', () => {
  const mockOnImpressionStart = vi.fn();
  const mockOnImpressionEnd = vi.fn();

  const defaultOptions: UseImpressionRefOptions = {
    onImpressionStart: mockOnImpressionStart,
    onImpressionEnd: mockOnImpressionEnd,
    timeThreshold: 100,
    rootMargin: '0px',
    areaThreshold: 0.5,
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    mockInstances.length = 0;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should call onImpressionStart when the element becomes visible', () => {
    const { result } = renderHook(() => useImpressionRef(defaultOptions));

    const mockElement = document.createElement('div');

    act(() => {
      result.current(mockElement);
    });

    const observerCallback = mockInstances[0].callback;
    act(() => {
      observerCallback([{ isIntersecting: true, intersectionRatio: 0.6 }], null);
      vi.runAllTimers();
    });

    expect(mockOnImpressionStart).toHaveBeenCalledTimes(1);
    expect(mockOnImpressionEnd).not.toHaveBeenCalled();
  });

  it('should call onImpressionEnd when the element goes out of view', () => {
    const { result } = renderHook(() => useImpressionRef(defaultOptions));

    const mockElement = document.createElement('div');

    act(() => {
      result.current(mockElement);
    });

    const observerCallback = mockInstances[0].callback;
    act(() => {
      observerCallback([{ isIntersecting: true, intersectionRatio: 0.6 }], null);
      vi.runAllTimers();
    });

    act(() => {
      observerCallback([{ isIntersecting: false, intersectionRatio: 0 }], null);
      vi.runAllTimers();
    });

    expect(mockOnImpressionStart).toHaveBeenCalledTimes(1);
    expect(mockOnImpressionEnd).toHaveBeenCalledTimes(1);
  });
});
