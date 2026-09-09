import { Fragment, startTransition, StrictMode, Suspense, useLayoutEffect } from 'react';
import { act, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useRefEffect } from './useRefEffect.ts';

describe('useRefEffect DOM lifecycle', () => {
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

  it('attaches with the new dependencies when a previously absent element appears', () => {
    const events: string[] = [];

    function Component({ value, visible }: { value: string; visible: boolean }) {
      const ref = useRefEffect<HTMLDivElement>(() => {
        events.push(`setup:${value}`);
        return () => events.push(`cleanup:${value}`);
      }, [value]);

      return visible ? <div ref={ref} /> : null;
    }

    const { rerender, unmount } = render(<Component value="A" visible={false} />);
    rerender(<Component value="B" visible />);
    expect(events).toEqual(['setup:B']);

    rerender(<Component value="C" visible={false} />);
    expect(events).toEqual(['setup:B', 'cleanup:B']);
    unmount();
    expect(events).toHaveLength(2);
  });

  it.each([false, true])('does not expose callbacks from a suspended render (deps change: %s)', async changeDeps => {
    const events: string[] = [];
    const renderedValues: string[] = [];
    const pending = new Promise<never>(() => {});
    let attach: (element: HTMLDivElement | null) => void = () => {};

    function Component({ value }: { value: string }) {
      const ref = useRefEffect<HTMLDivElement>(() => {
        events.push(`setup:${value}`);
        return () => events.push(`cleanup:${value}`);
      }, [changeDeps ? value : 'stable']);

      useLayoutEffect(
        function captureCommittedRef() {
          attach = ref;
        },
        [ref]
      );

      renderedValues.push(value);
      if (value === 'B') {
        throw pending;
      }

      return <div ref={ref}>{value}</div>;
    }

    const { rerender, getByText } = render(
      <Suspense fallback="Loading">
        <Component value="A" />
      </Suspense>
    );

    await act(async () => {
      startTransition(() => {
        rerender(
          <Suspense fallback="Loading">
            <Component value="B" />
          </Suspense>
        );
      });
    });

    expect(renderedValues).toContain('B');
    expect(getByText('A')).toBeVisible();
    events.length = 0;

    act(() => attach(document.createElement('div')));
    expect(events).toEqual(['cleanup:A', 'setup:A']);
  });
});
