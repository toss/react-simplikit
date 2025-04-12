import { describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useRefEffect } from './useRefEffect.ts';

describe('useRefEffect', () => {
  it('is safe on server side rendering', () => {
    const callback = vi.fn();
    renderHookSSR.serverOnly(() => useRefEffect(callback, []));

    expect(callback).not.toHaveBeenCalled();
  });

  it('should call the callback when a new element is set', async () => {
    const mockCallback = vi.fn();
    const { result } = await renderHookSSR(() => useRefEffect(mockCallback, []));

    const mockElement = document.createElement('div');
    result.current(mockElement);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(mockElement);
  });

  it('should call the cleanup function when the element changes', async () => {
    const mockCleanup = vi.fn();
    const mockCallback = vi.fn(() => mockCleanup);
    const { result } = await renderHookSSR(() => useRefEffect(mockCallback, []));

    const mockElement1 = document.createElement('div');
    result.current(mockElement1);

    const mockElement2 = document.createElement('div');
    result.current(mockElement2);

    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(mockCleanup).toHaveBeenCalledTimes(1);
  });

  it('should not call the callback when setting null', async () => {
    const mockCallback = vi.fn();
    const { result } = await renderHookSSR(() => useRefEffect(mockCallback, []));

    result.current(null);

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should call the cleanup function when setting null', async () => {
    const mockCleanup = vi.fn();
    const mockCallback = vi.fn(() => mockCleanup);
    const { result } = await renderHookSSR(() => useRefEffect(mockCallback, []));

    const mockElement = document.createElement('div');
    result.current(mockElement);

    result.current(null);

    expect(mockCleanup).toHaveBeenCalledTimes(1);
  });

  it('should respect dependencies and re-initialize when they change', async () => {
    const mockCallback1 = vi.fn();
    const mockCallback2 = vi.fn();
    let callback = mockCallback1;

    const { result, rerender } = await renderHookSSR(() => useRefEffect(callback, [callback]));

    const mockElement = document.createElement('div');
    result.current(mockElement);

    expect(mockCallback1).toHaveBeenCalledTimes(1);

    callback = mockCallback2;
    rerender();

    result.current(mockElement);

    expect(mockCallback2).toHaveBeenCalledTimes(1);
  });
});
