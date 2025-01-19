import { act, renderHook } from '@testing-library/react';
import { Mock, MockInstance, vi } from 'vitest';

import { useIntersectionObserver } from './useIntersectionObserver.legacy.ts';

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

describe('useIntersectionObserver', () => {
  let mockObserve: Mock;
  let mockUnobserve: Mock;
  let IntersectionObserverSpy: MockInstance;
  let originalIntersectionObserver: typeof IntersectionObserver | undefined;

  beforeEach(() => {
    mockObserve = vi.fn();
    mockUnobserve = vi.fn();

    IntersectionObserverSpy = vi.spyOn(global, 'IntersectionObserver').mockImplementation(() => {
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
      } as unknown as IntersectionObserver;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (originalIntersectionObserver !== undefined) {
      global.IntersectionObserver = originalIntersectionObserver;
    }
  });

  const setup = (callback = vi.fn()) => {
    const { result } = renderHook(() => useIntersectionObserver(callback, { root: null, threshold: 0.5 }));
    const mockElement = document.createElement('div');
    return { result, mockElement };
  };

  it('should observe the element when it is set', () => {
    const { result, mockElement } = setup();
    act(() => {
      result.current(mockElement);
    });

    expect(mockObserve).toHaveBeenCalledWith(mockElement);
  });

  it('should unobserve the element when it is removed', () => {
    const { result, mockElement } = setup();
    act(() => {
      result.current(mockElement);
      result.current(null);
    });

    expect(mockUnobserve).toHaveBeenCalledWith(mockElement);
  });

  it('should call the callback when an entry is observed', () => {
    const mockCallback = vi.fn();
    const { result, mockElement } = setup(mockCallback);
    act(() => {
      result.current(mockElement);
    });

    const observerCallback = IntersectionObserverSpy.mock.calls[0][0];
    const mockEntry = { target: mockElement, isIntersecting: true } as unknown as IntersectionObserverEntry;
    act(() => {
      observerCallback([mockEntry], null as unknown as IntersectionObserver);
    });

    expect(mockCallback).toHaveBeenCalledWith(mockEntry);
  });

  it('should not create an observer if IntersectionObserver is undefined', () => {
    originalIntersectionObserver = global.IntersectionObserver;
    delete (global as any).IntersectionObserver;

    const mockCallback = vi.fn();
    const { result, mockElement } = setup(mockCallback);
    act(() => {
      result.current(mockElement);
    });

    expect(mockObserve).not.toHaveBeenCalled();
  });
});
