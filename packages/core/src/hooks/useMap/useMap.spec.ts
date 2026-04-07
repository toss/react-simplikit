import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useMap } from './useMap.ts';

describe('useMap', () => {
  it('should initialize with a Map', async () => {
    const initialMap = new Map([[1, 'initial']]);
    const { result } = await renderHookSSR(() => useMap(initialMap));

    expect(result.current[0].get(1)).toBe('initial');
  });

  it('should initialize with an array of entries', async () => {
    const { result } = await renderHookSSR(() => useMap([[1, 'initial']]));

    expect(result.current[0].get(1)).toBe('initial');
  });

  it('should initialize with an empty Map when no arguments provided', async () => {
    const { result } = await renderHookSSR(() => useMap());

    expect(result.current[0].size).toBe(0);
  });

  it('should add a new value to the Map', async () => {
    const { result, rerender } = await renderHookSSR(() => useMap<number, string>());
    const [, actions] = result.current;

    expect(result.current[0].get(1)).toBeUndefined();

    await act(async () => {
      actions.set(1, 'added');
      rerender();
    });

    expect(result.current[0].get(1)).toBe('added');
  });

  it('should update an existing value in the Map', async () => {
    const initialMap = new Map([[1, 'initial']]);
    const { result, rerender } = await renderHookSSR(() => useMap(initialMap));
    const [, actions] = result.current;

    await act(async () => {
      actions.set(1, 'edited');
      rerender();
    });

    expect(result.current[0].get(1)).toBe('edited');
  });

  it('should replace all values with setAll', async () => {
    const initialMap = new Map([
      [1, 'initial'],
      [2, 'example'],
    ]);
    const { result, rerender } = await renderHookSSR(() => useMap(initialMap));
    const [, actions] = result.current;

    expect(result.current[0].get(1)).toBe('initial');
    expect(result.current[0].get(2)).toBe('example');
    expect(result.current[0].size).toBe(2);

    await act(async () => {
      actions.setAll([[1, 'edited']]);
      rerender();
    });

    expect(result.current[0].get(1)).toBe('edited');
    expect(result.current[0].get(2)).toBeUndefined();
    expect(result.current[0].size).toBe(1);
  });

  it('should remove an existing value from the Map', async () => {
    const initialMap = new Map([[1, 'initial']]);
    const { result, rerender } = await renderHookSSR(() => useMap(initialMap));
    const [, actions] = result.current;

    await act(async () => {
      actions.remove(1);
      rerender();
    });

    expect(result.current[0].get(1)).toBeUndefined();
    expect(result.current[0].size).toBe(0);
  });

  it('should reset the Map to its initial state', async () => {
    const initialMap = new Map([[1, 'initial']]);
    const { result, rerender } = await renderHookSSR(() => useMap(initialMap));
    const [, actions] = result.current;

    // First modify the map
    await act(async () => {
      actions.set(2, 'added');
      actions.set(1, 'modified');
      rerender();
    });

    expect(result.current[0].get(1)).toBe('modified');
    expect(result.current[0].get(2)).toBe('added');
    expect(result.current[0].size).toBe(2);

    // Then reset to initial state
    await act(async () => {
      actions.reset();
      rerender();
    });

    // Should be back to initial state
    expect(result.current[0].get(1)).toBe('initial');
    expect(result.current[0].get(2)).toBeUndefined();
    expect(result.current[0].size).toBe(1);
  });

  it('should reset to empty Map when initialized with empty Map', async () => {
    const { result, rerender } = await renderHookSSR(() => useMap<number, string>());
    const [, actions] = result.current;

    // Add some items
    await act(async () => {
      actions.set(1, 'one');
      actions.set(2, 'two');
      rerender();
    });

    expect(result.current[0].size).toBe(2);

    // Reset should restore to empty state
    await act(async () => {
      actions.reset();
      rerender();
    });

    expect(result.current[0].size).toBe(0);
  });

  it('should create a new Map reference when values change', async () => {
    const initialMap = new Map<number, number>();
    const { result, rerender } = await renderHookSSR(() => useMap(initialMap));
    const [originalMapRef, actions] = result.current;

    await act(async () => {
      actions.set(1, 1);
      rerender();
    });

    expect(originalMapRef).not.toBe(result.current[0]);
    expect(originalMapRef.get(1)).toBeUndefined();
    expect(result.current[0].get(1)).toBe(1);
  });

  it('should maintain stable actions reference after Map changes', async () => {
    const initialMap = new Map<number, number>();
    const { result, rerender } = await renderHookSSR(() => useMap(initialMap));
    const [, originalActionsRef] = result.current;

    expect(result.current[1]).toBe(originalActionsRef);

    await act(async () => {
      originalActionsRef.set(1, 1);
      rerender();
    });

    expect(result.current[1]).toBe(originalActionsRef);
  });

  it('is safe in server-side rendering', () => {
    const initialMap = new Map([[1, 'initial']]);
    renderHookSSR.serverOnly(() => useMap(initialMap));
    // This shouldn't throw any errors
  });
});
