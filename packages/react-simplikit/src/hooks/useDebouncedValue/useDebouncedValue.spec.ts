import { act } from '@testing-library/react';
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
});
