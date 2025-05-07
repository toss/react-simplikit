import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useCountdown } from './useCountdown.ts';

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with countStart value', () => {
    const { result } = renderHook(() => useCountdown(10, {}));

    expect(result.current[0]).toBe(10);
  });

  it('should decrement count when countdown is started', () => {
    const { result } = renderHook(() =>
      useCountdown(10, {
        interval: 1000,
      })
    );

    act(() => {
      result.current[1].start();
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current[0]).toBe(9);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current[0]).toBe(8);
  });

  it('should increment count when isIncrement is true', () => {
    const { result } = renderHook(() =>
      useCountdown(0, {
        countStop: 3,
        isIncrement: true,
        interval: 1000,
      })
    );

    act(() => {
      result.current[1].start();
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current[0]).toBe(1);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current[0]).toBe(2);
  });

  it('should stop countdown when count equals countStop value', () => {
    const { result } = renderHook(() =>
      useCountdown(2, {
        countStop: 0,
        interval: 1000,
      })
    );

    act(() => {
      result.current[1].start();
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current[0]).toBe(1);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current[0]).toBe(0);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current[0]).toBe(0);
  });

  it('should reset countdown when reset is called', () => {
    const { result } = renderHook(() =>
      useCountdown(10, {
        interval: 1000,
      })
    );

    act(() => {
      result.current[1].start();
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current[0]).toBe(8);

    act(() => {
      result.current[1].reset();
    });

    expect(result.current[0]).toBe(10);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current[0]).toBe(10);
  });

  it('should pause countdown when pause is called', () => {
    const { result } = renderHook(() =>
      useCountdown(10, {
        interval: 1000,
      })
    );

    act(() => {
      result.current[1].start();
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current[0]).toBe(9);

    act(() => {
      result.current[1].pause();
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current[0]).toBe(9);
  });

  it('should resume countdown when resume is called', () => {
    const { result } = renderHook(() =>
      useCountdown(10, {
        interval: 1000,
      })
    );

    act(() => {
      result.current[1].start();
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current[0]).toBe(9);

    act(() => {
      result.current[1].pause();
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current[0]).toBe(9);

    act(() => {
      result.current[1].resume();
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current[0]).toBe(8);
  });

  it('should call onCountChange when count changes', () => {
    const onCountChange = vi.fn();
    const { result } = renderHook(() =>
      useCountdown(10, {
        interval: 1000,
        onCountChange,
      })
    );

    expect(onCountChange).toHaveBeenCalledWith(10);

    act(() => {
      result.current[1].start();
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onCountChange).toHaveBeenCalledWith(9);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onCountChange).toHaveBeenCalledWith(8);
  });

  it('should call onComplete when countdown reaches countStop', () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useCountdown(2, {
        countStop: 0,
        interval: 1000,
        onComplete,
      })
    );

    act(() => {
      result.current[1].start();
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
