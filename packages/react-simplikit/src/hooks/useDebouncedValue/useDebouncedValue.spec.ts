import { StrictMode } from 'react';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useDebouncedValue } from './useDebouncedValue.ts';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('is safe on server side rendering', () => {
    const result = renderHookSSR.serverOnly(() => useDebouncedValue('a', 100));

    expect(result.current).toBe('a');
  });

  it('returns the initial value on first render', () => {
    const { result } = renderHookSSR(() => useDebouncedValue('a', 100));

    expect(result.current).toBe('a');
  });

  it('keeps the previous value until wait elapses, then follows the new value', () => {
    const { result, rerender } = renderHookSSR(({ value }) => useDebouncedValue(value, 100), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(99);
    });
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('b');
  });

  it('collapses several changes inside the window into the last one', () => {
    const { result, rerender } = renderHookSSR(({ value }) => useDebouncedValue(value, 100), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    rerender({ value: 'c' });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current).toBe('c');
  });

  it('applies the first change after an idle period immediately when leading is true', () => {
    const { result, rerender } = renderHookSSR(({ value }) => useDebouncedValue(value, 100, { leading: true }), {
      initialProps: { value: 'a' },
    });

    // idle for one full window before the sequence under test starts
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'b' });
    expect(result.current).toBe('b');

    rerender({ value: 'c' });
    expect(result.current).toBe('b');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('c');
  });

  it('applies only the first change when leading is true and trailing is false', () => {
    const { result, rerender } = renderHookSSR(
      ({ value }) => useDebouncedValue(value, 100, { leading: true, trailing: false }),
      { initialProps: { value: 'a' } }
    );

    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'b' });
    expect(result.current).toBe('b');

    rerender({ value: 'c' });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('b');
  });

  it('never updates when both leading and trailing are false', () => {
    const { result, rerender } = renderHookSSR(
      ({ value }) => useDebouncedValue(value, 100, { leading: false, trailing: false }),
      { initialProps: { value: 'a' } }
    );

    rerender({ value: 'b' });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe('a');
  });

  it('does not open a window on mount, so a change right after mount is leading', () => {
    const { result, rerender } = renderHookSSR(({ value }) => useDebouncedValue(value, 100, { leading: true }), {
      initialProps: { value: 'a' },
    });

    act(() => {
      vi.advanceTimersByTime(10);
    });
    rerender({ value: 'b' });

    expect(result.current).toBe('b');
  });

  it('never exposes an intermediate value when the input returns to the settled value inside the window', () => {
    const seen: string[] = [];
    const { rerender } = renderHookSSR(
      ({ value }) => {
        const debounced = useDebouncedValue(value, 100);
        seen.push(debounced);
        return debounced;
      },
      { initialProps: { value: 'a' } }
    );

    rerender({ value: 'b' });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    rerender({ value: 'a' });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(seen).not.toContain('b');
  });

  it('still converges when wait changes while an update is pending', () => {
    const { result, rerender } = renderHookSSR(({ value, wait }) => useDebouncedValue(value, wait), {
      initialProps: { value: 'a', wait: 100 },
    });

    rerender({ value: 'b', wait: 100 });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    rerender({ value: 'b', wait: 200 });
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('b');
  });

  it('cancels the pending update on unmount', () => {
    const { result, rerender, unmount } = renderHookSSR(({ value }) => useDebouncedValue(value, 100), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });
    unmount();
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe('a');
  });

  it('returns a function value as-is instead of calling it', () => {
    const fn = () => 'result';
    const { result } = renderHookSSR(() => useDebouncedValue(fn, 100));

    expect(result.current).toBe(fn);
  });

  it('treats a change right after mount as leading under StrictMode double effects', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 100, { leading: true }), {
      initialProps: { value: 'a' },
      wrapper: StrictMode,
    });

    expect(result.current).toBe('a');

    rerender({ value: 'b' });
    expect(result.current).toBe('b');
  });
});
