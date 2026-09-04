import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useThrottledValue } from './useThrottledValue.ts';

describe('useThrottledValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('is safe on server side rendering', () => {
    const result = renderHookSSR.serverOnly(() => useThrottledValue('a', 100));

    expect(result.current).toBe('a');
  });

  it('returns the initial value on first render', () => {
    const { result } = renderHookSSR(() => useThrottledValue('a', 100));

    expect(result.current).toBe('a');
  });

  it('applies the first change immediately and the last change at the end of the window', () => {
    const { result, rerender } = renderHookSSR(({ value }) => useThrottledValue(value, 100), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });
    expect(result.current).toBe('b');

    rerender({ value: 'c' });
    act(() => {
      vi.advanceTimersByTime(50);
    });
    rerender({ value: 'd' });
    expect(result.current).toBe('b');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('d');
  });

  it('updates once per window while the value keeps changing', () => {
    const { result, rerender } = renderHookSSR(({ value }) => useThrottledValue(value, 100), {
      initialProps: { value: 0 },
    });

    rerender({ value: 1 });
    expect(result.current).toBe(1);

    for (let i = 2; i <= 4; i++) {
      act(() => {
        vi.advanceTimersByTime(30);
      });
      rerender({ value: i });
      expect(result.current).toBe(1);
    }

    act(() => {
      vi.advanceTimersByTime(30);
    });
    rerender({ value: 5 });
    expect(result.current).toBe(5);
  });

  it('skips the trailing update when trailing is false', () => {
    const { result, rerender } = renderHookSSR(({ value }) => useThrottledValue(value, 100, { trailing: false }), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });
    expect(result.current).toBe('b');

    rerender({ value: 'c' });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('b');
  });

  it('defers the first change to the end of the window when leading is false', () => {
    const { result, rerender } = renderHookSSR(({ value }) => useThrottledValue(value, 100, { leading: false }), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'b' });
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('b');
  });

  it('never updates when both leading and trailing are false', () => {
    const { result, rerender } = renderHookSSR(
      ({ value }) => useThrottledValue(value, 100, { leading: false, trailing: false }),
      { initialProps: { value: 'a' } }
    );

    rerender({ value: 'b' });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe('a');
  });

  it('does not open a window on mount, so a change right after mount is leading', () => {
    const { result, rerender } = renderHookSSR(({ value }) => useThrottledValue(value, 100), {
      initialProps: { value: 'a' },
    });

    act(() => {
      vi.advanceTimersByTime(10);
    });
    rerender({ value: 'b' });

    expect(result.current).toBe('b');
  });

  it('still converges when wait changes while an update is pending', () => {
    const { result, rerender } = renderHookSSR(
      ({ value, wait }) => useThrottledValue(value, wait, { leading: false }),
      { initialProps: { value: 'a', wait: 100 } }
    );

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
    const { result, rerender, unmount } = renderHookSSR(
      ({ value }) => useThrottledValue(value, 100, { leading: false }),
      { initialProps: { value: 'a' } }
    );

    rerender({ value: 'b' });
    unmount();
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe('a');
  });
});
