import { beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { DebouncedFunction } from './debounce.ts';
import { useDebounce } from './useDebounce.ts';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('is safe on server side rendering', () => {
    const callback = vi.fn();
    renderHookSSR.serverOnly(() => useDebounce(callback, 100));

    expect(callback).not.toHaveBeenCalled();
  });

  it('should debounce the callback with default options', async () => {
    const callback = vi.fn();
    const { result } = await renderHookSSR(() => useDebounce(callback, 100));

    result.current();
    expect(callback).not.toBeCalled();

    vi.advanceTimersByTime(50);
    expect(callback).not.toBeCalled();

    vi.advanceTimersByTime(50);
    expect(callback).toBeCalledTimes(1);
  });

  it('should handle leading edge', async () => {
    const callback = vi.fn();
    const { result } = await renderHookSSR(() => useDebounce(callback, 100, { leading: true }));

    result.current();
    expect(callback).toBeCalledTimes(1);

    result.current();
    vi.advanceTimersByTime(50);
    expect(callback).toBeCalledTimes(1);

    vi.advanceTimersByTime(40);
    expect(callback).toBeCalledTimes(1);

    vi.advanceTimersByTime(10);
    expect(callback).toBeCalledTimes(2);
  });

  it('should handle trailing edge', async () => {
    const callback = vi.fn();
    const { result } = await renderHookSSR(() => useDebounce(callback, 100, { trailing: true }));

    result.current();
    expect(callback).not.toBeCalled();

    vi.advanceTimersByTime(50);
    result.current();
    expect(callback).not.toBeCalled();

    vi.advanceTimersByTime(100);
    expect(callback).toBeCalledTimes(1);
  });

  it('should handle both leading and trailing edges', async () => {
    const callback = vi.fn();
    const { result } = await renderHookSSR(() => useDebounce(callback, 100, { leading: true, trailing: true }));

    result.current();
    expect(callback).toBeCalledTimes(1);

    result.current();
    vi.advanceTimersByTime(150);
    expect(callback).toBeCalledTimes(2);
  });

  it('should inference the callback type', async () => {
    const callback = (value: string) => {
      console.log('test::', value);
    };

    const { result } = renderHookSSR(() => useDebounce(callback, 100));

    expectTypeOf(result.current).toEqualTypeOf<DebouncedFunction<typeof callback>>();
  });

  it('should cleanup on unmount', async () => {
    const callback = vi.fn();
    const { result, unmount } = await renderHookSSR(() => useDebounce(callback, 100));

    result.current();
    unmount();
    vi.advanceTimersByTime(100);

    expect(callback).not.toBeCalled();
  });
});
