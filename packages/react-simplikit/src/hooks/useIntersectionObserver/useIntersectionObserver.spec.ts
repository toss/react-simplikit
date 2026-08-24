/* eslint-disable @typescript-eslint/no-explicit-any */
import { act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, Mock, MockInstance, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useIntersectionObserver } from './useIntersectionObserver.ts';

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

  const setup = async (callback = vi.fn()) => {
    const { result } = await renderHookSSR(() => useIntersectionObserver(callback, { root: null, threshold: 0.5 }));
    const mockElement = document.createElement('div');
    return { result, mockElement };
  };

  it('is safe on server side rendering', () => {
    const callback = vi.fn();
    renderHookSSR.serverOnly(() => useIntersectionObserver(callback, { root: null, threshold: 0.5 }));

    expect(callback).not.toHaveBeenCalled();
  });

  it('should observe the element when it is set', async () => {
    const { result, mockElement } = await setup();
    await act(async () => {
      result.current(mockElement);
    });

    expect(mockObserve).toHaveBeenCalledWith(mockElement);
  });

  it('should unobserve the element when it is removed', async () => {
    const { result, mockElement } = await setup();
    await act(async () => {
      result.current(mockElement);
      result.current(null);
    });

    expect(mockUnobserve).toHaveBeenCalledWith(mockElement);
  });

  it('should call the callback when an entry is observed', async () => {
    const mockCallback = vi.fn();
    const { result, mockElement } = await setup(mockCallback);
    await act(async () => {
      result.current(mockElement);
    });

    const observerCallback = IntersectionObserverSpy.mock.calls[0][0];
    const mockEntry = { target: mockElement, isIntersecting: true } as unknown as IntersectionObserverEntry;
    await act(async () => {
      observerCallback([mockEntry], null as unknown as IntersectionObserver);
    });

    expect(mockCallback).toHaveBeenCalledWith(mockEntry);
  });

  it('should not create an observer if IntersectionObserver is undefined', async () => {
    originalIntersectionObserver = global.IntersectionObserver;
    delete (global as any).IntersectionObserver;

    const mockCallback = vi.fn();
    const { result, mockElement } = await setup(mockCallback);
    await act(async () => {
      result.current(mockElement);
    });

    expect(mockObserve).not.toHaveBeenCalled();
  });
});
