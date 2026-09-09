/* eslint-disable @typescript-eslint/no-explicit-any */
import { createElement } from 'react';
import { act, render } from '@testing-library/react';
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

  it('should recreate the observer when threshold, rootMargin, or root changes', async () => {
    const root = document.createElement('div');
    const { result, rerender } = await renderHookSSR(
      (props: IntersectionObserverInit) => useIntersectionObserver(vi.fn(), props),
      { initialProps: { root: null, rootMargin: '0px', threshold: 0.5 } as IntersectionObserverInit }
    );
    const mockElement = document.createElement('div');

    await act(async () => {
      result.current(mockElement);
    });
    expect(IntersectionObserverSpy).toHaveBeenCalledTimes(1);

    rerender({ root: null, rootMargin: '0px', threshold: [0, 0.5] });
    expect(IntersectionObserverSpy).toHaveBeenCalledTimes(2);

    rerender({ root: null, rootMargin: '10px', threshold: [0, 0.5] });
    expect(IntersectionObserverSpy).toHaveBeenCalledTimes(3);

    rerender({ root, rootMargin: '10px', threshold: [0, 0.5] });
    expect(IntersectionObserverSpy).toHaveBeenCalledTimes(4);
  });

  it('should not recreate the observer when a new threshold array has the same values in the same order', async () => {
    const { result, rerender } = await renderHookSSR(
      (props: IntersectionObserverInit) => useIntersectionObserver(vi.fn(), props),
      { initialProps: { threshold: [0, 0.25, 0.5] } as IntersectionObserverInit }
    );
    const mockElement = document.createElement('div');

    await act(async () => {
      result.current(mockElement);
    });
    expect(IntersectionObserverSpy).toHaveBeenCalledTimes(1);

    // A brand-new array instance with identical values must not be treated as a change.
    rerender({ threshold: [0, 0.25, 0.5] });
    expect(IntersectionObserverSpy).toHaveBeenCalledTimes(1);
    expect(mockUnobserve).not.toHaveBeenCalled();

    // Same values, different order: a real change, so it should recreate.
    rerender({ threshold: [0.5, 0.25, 0] });
    expect(IntersectionObserverSpy).toHaveBeenCalledTimes(2);
  });

  it.each(['root', 'rootMargin', 'threshold'] as const)(
    'should move a mounted element to the new observer when %s changes',
    option => {
      const observers: MockIntersectionObserver[] = [];
      IntersectionObserverSpy.mockImplementation(() => {
        const observer = new MockIntersectionObserver();
        observers.push(observer);
        return observer;
      });

      function Component({ options }: { options: IntersectionObserverInit }) {
        const ref = useIntersectionObserver<HTMLDivElement>(() => {}, options);
        return createElement('div', { ref });
      }

      const initialOptions = { root: null, rootMargin: '0px', threshold: 0.5 };
      const nextOptions: IntersectionObserverInit = {
        ...initialOptions,
        [option]: { root: document.createElement('div'), rootMargin: '10px', threshold: [0, 0.5] }[option],
      };
      const { container, rerender, unmount } = render(createElement(Component, { options: initialOptions }));
      const element = container.firstElementChild;

      rerender(createElement(Component, { options: nextOptions }));

      expect(observers).toHaveLength(2);
      expect(observers[0].observe).toHaveBeenCalledTimes(1);
      expect(observers[0].unobserve).toHaveBeenCalledWith(element);
      expect(observers[1].observe).toHaveBeenCalledTimes(1);
      expect(observers[1].observe).toHaveBeenCalledWith(element);

      unmount();
      expect(observers[1].unobserve).toHaveBeenCalledTimes(1);
      expect(observers[1].unobserve).toHaveBeenCalledWith(element);
    }
  );
});
