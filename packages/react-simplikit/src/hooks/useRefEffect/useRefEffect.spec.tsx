import { Fragment, startTransition, StrictMode, Suspense, useLayoutEffect } from 'react';
import { act, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useRefEffect } from './useRefEffect.ts';

describe('useRefEffect', () => {
  it('is safe on server side rendering', () => {
    const callback = vi.fn();
    renderHookSSR.serverOnly(() => useRefEffect(callback, []));

    expect(callback).not.toHaveBeenCalled();
  });

  it('should call the callback when a new element is set', async () => {
    const mockCallback = vi.fn();
    const { result } = await renderHookSSR(() => useRefEffect(mockCallback, []));

    const mockElement = document.createElement('div');
    result.current(mockElement);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(mockElement);
  });

  it('should call the cleanup function when the element changes', async () => {
    const mockCleanup = vi.fn();
    const mockCallback = vi.fn(() => mockCleanup);
    const { result } = await renderHookSSR(() => useRefEffect(mockCallback, []));

    const mockElement1 = document.createElement('div');
    result.current(mockElement1);

    const mockElement2 = document.createElement('div');
    result.current(mockElement2);

    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(mockCleanup).toHaveBeenCalledTimes(1);
  });

  it('should not call the callback when setting null', async () => {
    const mockCallback = vi.fn();
    const { result } = await renderHookSSR(() => useRefEffect(mockCallback, []));

    result.current(null);

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should call the cleanup function when setting null', async () => {
    const mockCleanup = vi.fn();
    const mockCallback = vi.fn(() => mockCleanup);
    const { result } = await renderHookSSR(() => useRefEffect(mockCallback, []));

    const mockElement = document.createElement('div');
    result.current(mockElement);

    result.current(null);

    expect(mockCleanup).toHaveBeenCalledTimes(1);
  });

  it('should respect dependencies and re-initialize when they change', async () => {
    const mockCallback1 = vi.fn();
    const mockCallback2 = vi.fn();
    let callback = mockCallback1;

    const { result, rerender } = await renderHookSSR(() => useRefEffect(callback, [callback]));

    const mockElement = document.createElement('div');
    result.current(mockElement);

    expect(mockCallback1).toHaveBeenCalledTimes(1);

    callback = mockCallback2;
    rerender();

    result.current(mockElement);

    expect(mockCallback2).toHaveBeenCalledTimes(1);
  });

  it.each([false, true])('uses the new dependency value during ref attachment (StrictMode: %s)', strict => {
    const events: string[] = [];

    function Component({ value }: { value: string }) {
      const ref = useRefEffect<HTMLDivElement>(() => {
        events.push(`setup:${value}`);
        return () => events.push(`cleanup:${value}`);
      }, [value]);

      return <div ref={ref} />;
    }

    const { rerender, unmount } = render(<Component value="A" />, { wrapper: strict ? StrictMode : Fragment });
    events.length = 0;

    rerender(<Component value="B" />);
    expect(events).toEqual(['cleanup:A', 'setup:B']);

    rerender(<Component value="C" />);
    expect(events).toEqual(['cleanup:A', 'setup:B', 'cleanup:B', 'setup:C']);

    unmount();
    expect(events.at(-1)).toBe('cleanup:C');
  });

  it('keeps the ref attached when an inline callback changes without a dependency change', () => {
    const events: string[] = [];

    function Component({ label }: { label: string }) {
      const ref = useRefEffect<HTMLDivElement>(() => {
        events.push(`setup:${label}`);
        return () => events.push(`cleanup:${label}`);
      }, []);

      return <div ref={ref}>{label}</div>;
    }

    const { rerender, unmount } = render(<Component label="A" />);
    rerender(<Component label="B" />);
    expect(events).toEqual(['setup:A']);

    unmount();
    expect(events).toEqual(['setup:A', 'cleanup:A']);
  });

  it('uses the latest committed callback when a node is replaced after an unchanged-deps render', () => {
    const events: string[] = [];

    function Component({ label, nodeKey }: { label: string; nodeKey: string }) {
      const ref = useRefEffect<HTMLDivElement>(element => {
        events.push(`setup:${label}:${element.id}`);
        return () => events.push(`cleanup:${label}:${element.id}`);
      }, []);

      return <div key={nodeKey} id={nodeKey} ref={ref} />;
    }

    const { rerender, unmount } = render(<Component label="A" nodeKey="first" />);
    rerender(<Component label="B" nodeKey="first" />);
    rerender(<Component label="B" nodeKey="second" />);

    expect(events).toEqual(['setup:A:first', 'cleanup:A:first', 'setup:B:second']);
    unmount();
    expect(events.at(-1)).toBe('cleanup:B:second');
  });

  it('ignores the callback from a render that did not commit', async () => {
    const events: string[] = [];
    const renderedValues: string[] = [];
    const pending = new Promise<never>(() => {});
    let attachCommittedRef: (element: HTMLDivElement | null) => void = () => {};

    function Component({ value }: { value: string }) {
      const ref = useRefEffect<HTMLDivElement>(() => {
        events.push(`setup:${value}`);
        return () => events.push(`cleanup:${value}`);
      }, []);

      useLayoutEffect(
        function captureCommittedRef() {
          attachCommittedRef = ref;
        },
        [ref]
      );

      renderedValues.push(value);
      if (value === 'uncommitted') {
        throw pending;
      }

      return <div ref={ref}>{value}</div>;
    }

    const { rerender, getByText } = render(
      <Suspense fallback="Loading">
        <Component value="committed" />
      </Suspense>
    );

    await act(async () => {
      startTransition(() => {
        rerender(
          <Suspense fallback="Loading">
            <Component value="uncommitted" />
          </Suspense>
        );
      });
    });

    expect(renderedValues).toContain('uncommitted');
    expect(getByText('committed')).toBeVisible();
    events.length = 0;

    // Reattaching the committed ref must ignore the callback from the suspended render.
    act(() => attachCommittedRef(document.createElement('div')));
    expect(events).toEqual(['cleanup:committed', 'setup:committed']);
  });
});
