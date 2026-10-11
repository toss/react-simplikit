import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useDebouncedState } from './useDebouncedState.ts';

function actions<T>(result: { current: [T, (nextValue: T) => void] }) {
  function getValue() {
    return result.current[0];
  }

  function setValue(value: T) {
    act(() => {
      result.current[1](value);
    });
  }

  return { getValue, setValue };
}

describe('useDebouncedState', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('is safe on server side rendering', async () => {
    const result = renderHookSSR.serverOnly(() => useDebouncedState('a', 100));
    const { getValue } = actions(result);
    expect(getValue()).toBe('a');
  });

  it('returns the initial value on first render', () => {
    const { result } = renderHookSSR(() => useDebouncedState('a', 100));
    const { getValue } = actions(result);
    expect(getValue()).toBe('a');
  });

  it('keeps the previous state until debounceMs elapses with default options', () => {
    const { result } = renderHookSSR(() => useDebouncedState('a', 100));
    const { getValue, setValue } = actions(result);

    setValue('b');
    expect(getValue()).toBe('a');

    act(() => {
      vi.advanceTimersByTime(99);
    });
    expect(getValue()).toBe('a');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(getValue()).toBe('b');
  });

  it('restarts the delay on each setter call and applies only the last value', () => {
    const { result } = renderHookSSR(() => useDebouncedState('a', 100));
    const { getValue, setValue } = actions(result);

    setValue('b');

    act(() => {
      vi.advanceTimersByTime(50);
    });

    setValue('c');
    expect(getValue()).toBe('a');

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(getValue()).toBe('a');

    act(() => {
      vi.advanceTimersByTime(59);
    });
    expect(getValue()).toBe('c');
  });

  it('applies the last additional value after the delay when both leading and trailing are true', () => {
    const { result } = renderHookSSR(() => useDebouncedState('a', 100, { leading: true, trailing: true }));
    const { getValue, setValue } = actions(result);

    setValue('b');
    expect(getValue()).toBe('b');

    act(() => {
      vi.advanceTimersByTime(50);
    });
    setValue('c');

    act(() => {
      vi.advanceTimersByTime(99);
    });
    expect(getValue()).toBe('b');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(getValue()).toBe('c');
  });

  it('applies only the first value of each burst immediately when leading is true and trailing is false', () => {
    const { result } = renderHookSSR(() => useDebouncedState('a', 100, { leading: true, trailing: false }));
    const { getValue, setValue } = actions(result);

    setValue('b');
    expect(getValue()).toBe('b');

    act(() => {
      vi.advanceTimersByTime(50);
    });
    setValue('c');
    expect(getValue()).toBe('b');

    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(getValue()).toBe('b');

    setValue('d');
    expect(getValue()).toBe('d');
  });

  it('never updates the state when both leading and trailing are false', () => {
    const { result } = renderHookSSR(() => useDebouncedState('a', 100, { leading: false, trailing: false }));
    const { getValue, setValue } = actions(result);

    setValue('b');
    expect(getValue()).toBe('a');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(getValue()).toBe('a');
  });

  it('never exposes a pending intermediate value when the last setter call returns to the current value', () => {
    const valueLog: string[] = [];
    const { result } = renderHookSSR(() => {
      const state = useDebouncedState('a', 100);
      valueLog.push(state[0]);
      return state;
    });
    const { getValue, setValue } = actions(result);

    setValue('b');
    act(() => {
      vi.advanceTimersByTime(50);
    });
    setValue('a');

    act(() => {
      vi.advanceTimersByTime(50);
    });
    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(getValue()).toBe('a');
    expect(valueLog).not.toContain('b');
  });

  it('stores a function initial value without calling it', () => {
    const fn = vi.fn(() => 'result');
    const { result } = renderHookSSR(() => useDebouncedState(fn, 100));

    expect(result.current[0]).toBe(fn);
    expect(fn).not.toHaveBeenCalled();
  });

  it('stores a function passed to the setter without calling it', () => {
    const initialFn = () => 'initial';
    const nextFn = vi.fn(() => 'next');
    const { result } = renderHookSSR(() => useDebouncedState(initialFn, 100));

    const { getValue, setValue } = actions(result);

    setValue(nextFn);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(getValue()).toBe(nextFn);
    expect(nextFn).not.toHaveBeenCalled();
  });

  it('cancels a pending update when debounceMs changes and uses the new delay for subsequent calls', () => {
    const { result, rerender } = renderHookSSR(({ debounceMs }) => useDebouncedState('a', debounceMs), {
      initialProps: { debounceMs: 100 },
    });
    const { getValue, setValue } = actions(result);

    setValue('b');
    rerender({ debounceMs: 200 });
    act(() => vi.advanceTimersByTime(200));
    expect(getValue()).toBe('a');

    setValue('c');
    act(() => vi.advanceTimersByTime(199));
    expect(getValue()).toBe('a');
    act(() => vi.advanceTimersByTime(1));
    expect(getValue()).toBe('c');
  });

  it('cancels a pending update when debounce options changes and applies subsequent calls immediately', () => {
    const { result, rerender } = renderHookSSR(({ leading }) => useDebouncedState('a', 100, { leading }), {
      initialProps: { leading: false },
    });
    const { getValue, setValue } = actions(result);

    setValue('b');
    rerender({ leading: true });
    act(() => vi.advanceTimersByTime(100));
    expect(getValue()).toBe('a');

    setValue('c');
    expect(getValue()).toBe('c');
  });

  it('cancels the pending timer on unmount', () => {
    const { result, unmount } = renderHookSSR(() => useDebouncedState('a', 100));
    const { setValue } = actions(result);

    setValue('b');
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
