import { act, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useThrottledState } from './useThrottledState.ts';

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

describe('useThrottledState', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('is safe on server side rendering', () => {
    const result = renderHookSSR.serverOnly(() => useThrottledState('a', 100));

    expect(result.current[0]).toBe('a');
  });

  it('should return the initial value', () => {
    const { result } = renderHookSSR(() => useThrottledState('a', 100));
    const { getValue } = actions(result);
    expect(getValue()).toBe('a');
  });

  it('should skip the leading edge when leading is false', () => {
    const { result } = renderHookSSR(() => useThrottledState('a', 100, { leading: false }));
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

  it('should throttle continuous state updates', () => {
    const { result } = renderHookSSR(() => useThrottledState('a', 100));
    const { getValue, setValue } = actions(result);

    setValue('b');
    expect(getValue()).toBe('b');

    act(() => vi.advanceTimersByTime(40));
    setValue('c');
    expect(getValue()).toBe('b');

    act(() => vi.advanceTimersByTime(40));
    setValue('d');
    expect(getValue()).toBe('b');

    act(() => vi.advanceTimersByTime(40));
    setValue('e');
    expect(getValue()).toBe('e');
  });

  it('should update on leading and trailing edges by default throttle options', () => {
    const { result } = renderHookSSR(() => useThrottledState('a', 100));
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

  it('should skip the trailing edge when trailing is false', () => {
    const { result } = renderHookSSR(() => useThrottledState('a', 100, { leading: true, trailing: false }));
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

  it('should not update when both edges are disabled', () => {
    const { result } = renderHookSSR(() => useThrottledState('a', 100, { leading: false, trailing: false }));
    const { getValue, setValue } = actions(result);

    setValue('b');
    expect(getValue()).toBe('a');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(getValue()).toBe('a');
  });

  it('should discard a pending value when returning to the current state', () => {
    const valueLog: string[] = [];
    const { result } = renderHookSSR(() => {
      const state = useThrottledState('a', 100, { leading: false });
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

  it('should store a function initial value without calling it', () => {
    const fn = vi.fn(() => 'result');
    const { result } = renderHookSSR(() => useThrottledState(fn, 100));

    expect(result.current[0]).toBe(fn);
    expect(fn).not.toHaveBeenCalled();
  });

  it('should store a function update without calling it', () => {
    const initialFn = () => 'initial';
    const nextFn = vi.fn(() => 'next');
    const { result } = renderHookSSR(() => useThrottledState(initialFn, 100));

    const { getValue, setValue } = actions(result);

    setValue(nextFn);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(getValue()).toBe(nextFn);
    expect(nextFn).not.toHaveBeenCalled();
  });

  it('should reset throttling when throttleMs changes', () => {
    const { result, rerender } = renderHookSSR(
      ({ throttleMs }) => useThrottledState('a', throttleMs, { leading: false }),
      {
        initialProps: { throttleMs: 100 },
      }
    );
    const { getValue, setValue } = actions(result);

    setValue('b');
    rerender({ throttleMs: 200 });
    act(() => vi.advanceTimersByTime(200));
    expect(getValue()).toBe('a');

    setValue('c');
    act(() => vi.advanceTimersByTime(199));
    expect(getValue()).toBe('a');
    act(() => vi.advanceTimersByTime(1));
    expect(getValue()).toBe('c');
  });

  it('should reset throttling when throttle options changes', () => {
    const { result, rerender } = renderHookSSR(({ leading }) => useThrottledState('a', 100, { leading }), {
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

  it('should cancel pending updates on unmount', () => {
    const { result, unmount } = renderHookSSR(() => useThrottledState('a', 100, { leading: false }));
    const { setValue } = actions(result);

    setValue('b');
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
