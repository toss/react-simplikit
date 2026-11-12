import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useCounter } from './useCounter.ts';

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());

    expect(result.current[0]).toBe(0);
  });

  it('should initialize with provided initial value', () => {
    const { result } = renderHook(() => useCounter(10));

    expect(result.current[0]).toBe(10);
  });

  it('should increment the counter', async () => {
    const { result } = renderHook(() => useCounter(5));

    await act(async () => {
      result.current[1].increment();
    });

    expect(result.current[0]).toBe(6);
  });

  it('should decrement the counter', async () => {
    const { result } = renderHook(() => useCounter(5));

    await act(async () => {
      result.current[1].decrement();
    });

    expect(result.current[0]).toBe(4);
  });

  it('should reset the counter to initial value', async () => {
    const { result } = renderHook(() => useCounter(5));

    await act(async () => {
      result.current[1].increment();
      result.current[1].increment();
    });

    expect(result.current[0]).toBe(7);

    await act(async () => {
      result.current[1].reset();
    });

    expect(result.current[0]).toBe(5);
  });

  it('should not go below minimum value', async () => {
    const { result } = renderHook(() =>
      useCounter(5, {
        min: 3,
      })
    );

    await act(async () => {
      result.current[1].decrement();
      result.current[1].decrement();
      result.current[1].decrement();
    });

    expect(result.current[0]).toBe(3);
  });

  it('should not go above maximum value', async () => {
    const { result } = renderHook(() =>
      useCounter(5, {
        max: 7,
      })
    );

    await act(async () => {
      result.current[1].increment();
      result.current[1].increment();
      result.current[1].increment();
    });

    expect(result.current[0]).toBe(7);
  });

  it('should use the provided step value for increment and decrement', async () => {
    const { result } = renderHook(() =>
      useCounter(5, {
        step: 2,
      })
    );

    await act(async () => {
      result.current[1].increment();
    });

    expect(result.current[0]).toBe(7);

    await act(async () => {
      result.current[1].decrement();
    });

    expect(result.current[0]).toBe(5);
  });

  it('should adjust initial value to match constraints', () => {
    const { result } = renderHook(() =>
      useCounter(1, {
        min: 3,
      })
    );

    expect(result.current[0]).toBe(3);

    const { result: result2 } = renderHook(() =>
      useCounter(10, {
        max: 8,
      })
    );

    expect(result2.current[0]).toBe(8);
  });

  it('should allow setting arbitrary value within constraints', async () => {
    const { result } = renderHook(() =>
      useCounter(0, {
        min: 3,
        max: 8,
      })
    );

    await act(async () => {
      result.current[1].setCount(6);
    });

    expect(result.current[0]).toBe(6);

    await act(async () => {
      result.current[1].setCount(1);
    });

    expect(result.current[0]).toBe(3);

    await act(async () => {
      result.current[1].setCount(10);
    });

    expect(result.current[0]).toBe(8);
  });

  it('should work with updater function for setCount', async () => {
    const { result } = renderHook(() => useCounter(5));

    await act(async () => {
      result.current[1].setCount(prev => prev + 3);
    });

    expect(result.current[0]).toBe(8);
  });

  it('should keep the actions object stable across renders', () => {
    const { result } = renderHook(() => useCounter(0));
    const [, actions] = result.current;

    act(() => {
      actions.increment();
    });

    expect(result.current[0]).toBe(1);
    expect(result.current[1]).toBe(actions);
  });
});
