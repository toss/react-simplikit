import { Dispatch, SetStateAction } from 'react';
import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useDebouncedState } from './useDebouncedState.ts';

function actions<T>(result: { current: [T, Dispatch<SetStateAction<T>>] }) {
  function getValue() {
    return result.current[0];
  }

  function setValue(value: SetStateAction<T>) {
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

  it('should return the initial value', () => {
    const { result } = renderHookSSR(() => useDebouncedState('a', 100));
    const { getValue } = actions(result);
    expect(getValue()).toBe('a');
  });

  it('should update only on the trailing edge by default debounce options', () => {
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

  it('should debounce continuous state updates', () => {
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

  it('should update on leading and trailing edges when both are enabled', () => {
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

  it('should update only on the leading edge when trailing is false', () => {
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

  it('should not update when both edges are disabled', () => {
    const { result } = renderHookSSR(() => useDebouncedState('a', 100, { leading: false, trailing: false }));
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

  it('should support updater functions followed by direct value updates', () => {
    const { result } = renderHookSSR(() => useDebouncedState('a', 100));
    const { getValue, setValue } = actions(result);

    setValue(prev => prev + 'b');
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(getValue()).toBe('ab');

    setValue('c');
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(getValue()).toBe('c');
  });

  it('should apply only the last updater function during continuous updates', () => {
    const { result } = renderHookSSR(() => useDebouncedState('z', 100));
    const { getValue, setValue } = actions(result);

    setValue(prev => prev + 'b');
    act(() => {
      vi.advanceTimersByTime(99);
    });

    setValue(prev => prev + 'c');
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(getValue()).toBe('zc');
  });

  it('should apply a direct value after an updater without a render in between', () => {
    const { result } = renderHookSSR(() => useDebouncedState(0, 100, { leading: true }));
    const { getValue, setValue } = actions(result);

    act(() => {
      setValue(prev => prev + 1);
      setValue(0);
      vi.advanceTimersByTime(100);
    });

    expect(getValue()).toBe(0);
  });

  it('should store a function initial value without calling it', () => {
    const fn = vi.fn(() => 'result');
    const { result } = renderHookSSR(() => useDebouncedState(fn, 100));

    expect(result.current[0]).toBe(fn);
    expect(fn).not.toHaveBeenCalled();
  });

  it('should store a function update without calling it', () => {
    const initialFn = () => 'initial';
    const nextFn = vi.fn(() => 'next');
    const { result } = renderHookSSR(() => useDebouncedState(initialFn, 100));

    const { getValue, setValue } = actions(result);

    setValue(() => nextFn);

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(getValue()).toBe(nextFn);
    expect(nextFn).not.toHaveBeenCalled();
  });

  it('should reset debouncing when debounceMs changes', () => {
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

  it('should reset debouncing when debounce options changes', () => {
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

  it('should cancel pending updates on unmount', () => {
    const { result, unmount } = renderHookSSR(() => useDebouncedState('a', 100));
    const { setValue } = actions(result);

    setValue('b');
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
