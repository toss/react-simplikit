import { describe, expect, it } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { usePrevious } from './usePrevious.ts';

describe('usePrevious', () => {
  it('is safe on server side rendering', () => {
    const result = renderHookSSR.serverOnly(() => usePrevious(1));

    expect(result.current).toBe(1);
  });

  it('should return initial value of state on first mount', async () => {
    const { result } = await renderHookSSR(() => usePrevious(1));
    expect(result.current).toBe(1);
  });

  it('should return previous state after update', async () => {
    const { result, rerender } = await renderHookSSR(({ state }) => usePrevious(state), {
      initialProps: { state: 1 },
    });

    expect(result.current).toBe(1);

    rerender({ state: 2 });
    expect(result.current).toBe(1);

    rerender({ state: 3 });
    expect(result.current).toBe(2);
  });

  it('should not update previous state if state has not changed', async () => {
    const { result, rerender } = await renderHookSSR(({ state }) => usePrevious(state), {
      initialProps: { state: 1, otherState: 1 },
    });

    rerender({ state: 2, otherState: 1 });
    expect(result.current).toBe(1);

    rerender({ state: 2, otherState: 2 });
    expect(result.current).toBe(1);

    rerender({ state: 3, otherState: 2 });
    expect(result.current).toBe(2);
  });

  it('should custom compare function works', async () => {
    const compareObject = (prev: Record<string, unknown> | undefined, next: Record<string, unknown>) => {
      if (prev === undefined) {
        return false;
      }

      return Object.entries(prev).every(([key, value]) => next[key] === value);
    };
    const { result, rerender } = await renderHookSSR(({ state }) => usePrevious(state, compareObject), {
      initialProps: { state: { hello: 'world' }, otherState: 1 },
    });

    expect(result.current).toStrictEqual({ hello: 'world' });

    rerender({ state: { hello: 'world!' }, otherState: 1 });
    expect(result.current).toStrictEqual({ hello: 'world' });

    rerender({ state: { hello: 'world!' }, otherState: 2 });
    expect(result.current).toStrictEqual({ hello: 'world' });

    rerender({ state: { hello: 'world!!' }, otherState: 2 });
    expect(result.current).toStrictEqual({ hello: 'world!' });
  });
});
