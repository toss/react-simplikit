import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useSet } from './useSet.ts';

describe('useSet', () => {
  it('is safe on server side rendering', () => {
    const initialSet = new Set([1, 2, 3]);
    renderHookSSR.serverOnly(() => useSet(initialSet));
  });

  it('should initialize with a Set', async () => {
    const initialSet = new Set(['a', 'b']);
    const { result } = await renderHookSSR(() => useSet(initialSet));

    expect(result.current[0].has('a')).toBe(true);
    expect(result.current[0].has('b')).toBe(true);
    expect(result.current[0].size).toBe(2);
  });

  it('should initialize with an array of values', async () => {
    const { result } = await renderHookSSR(() => useSet([1, 2, 3]));

    expect(result.current[0].has(1)).toBe(true);
    expect(result.current[0].has(2)).toBe(true);
    expect(result.current[0].has(3)).toBe(true);
    expect(result.current[0].size).toBe(3);
  });

  it('should initialize with an empty Set when no arguments provided', async () => {
    const { result } = await renderHookSSR(() => useSet());

    expect(result.current[0].size).toBe(0);
  });

  it('should add a value to the Set', async () => {
    const { result, rerender } = await renderHookSSR(() => useSet<string>());
    const [, actions] = result.current;

    expect(result.current[0].has('a')).toBe(false);

    await act(async () => {
      actions.add('a');
      rerender();
    });

    expect(result.current[0].has('a')).toBe(true);
    expect(result.current[0].size).toBe(1);
  });

  it('should not duplicate values when adding an existing value', async () => {
    const { result, rerender } = await renderHookSSR(() => useSet(['a']));
    const [, actions] = result.current;

    await act(async () => {
      actions.add('a');
      rerender();
    });

    expect(result.current[0].size).toBe(1);
  });

  it('should remove a value from the Set', async () => {
    const { result, rerender } = await renderHookSSR(() => useSet(['a', 'b']));
    const [, actions] = result.current;

    await act(async () => {
      actions.remove('a');
      rerender();
    });

    expect(result.current[0].has('a')).toBe(false);
    expect(result.current[0].has('b')).toBe(true);
    expect(result.current[0].size).toBe(1);
  });

  it('should do nothing when removing a value not in the Set', async () => {
    const { result, rerender } = await renderHookSSR(() => useSet(['a']));
    const [, actions] = result.current;

    await act(async () => {
      actions.remove('z');
      rerender();
    });

    expect(result.current[0].has('a')).toBe(true);
    expect(result.current[0].size).toBe(1);
  });

  it('should toggle a value - add if absent', async () => {
    const { result, rerender } = await renderHookSSR(() => useSet<string>());
    const [, actions] = result.current;

    await act(async () => {
      actions.toggle('a');
      rerender();
    });

    expect(result.current[0].has('a')).toBe(true);
  });

  it('should toggle a value - remove if present', async () => {
    const { result, rerender } = await renderHookSSR(() => useSet(['a']));
    const [, actions] = result.current;

    await act(async () => {
      actions.toggle('a');
      rerender();
    });

    expect(result.current[0].has('a')).toBe(false);
  });

  it('should replace all values with setAll', async () => {
    const { result, rerender } = await renderHookSSR(() => useSet([1, 2, 3]));
    const [, actions] = result.current;

    await act(async () => {
      actions.setAll([4, 5]);
      rerender();
    });

    expect(result.current[0].has(1)).toBe(false);
    expect(result.current[0].has(4)).toBe(true);
    expect(result.current[0].has(5)).toBe(true);
    expect(result.current[0].size).toBe(2);
  });

  it('should replace all values with setAll using a Set', async () => {
    const { result, rerender } = await renderHookSSR(() => useSet([1, 2, 3]));
    const [, actions] = result.current;

    await act(async () => {
      actions.setAll(new Set([4, 5]));
      rerender();
    });

    expect(result.current[0].has(1)).toBe(false);
    expect(result.current[0].has(4)).toBe(true);
    expect(result.current[0].has(5)).toBe(true);
    expect(result.current[0].size).toBe(2);
  });

  it('should reset the Set to its initial state', async () => {
    const initialSet = new Set([1, 2]);
    const { result, rerender } = await renderHookSSR(() => useSet(initialSet));
    const [, actions] = result.current;

    await act(async () => {
      actions.add(3);
      actions.remove(1);
      rerender();
    });

    expect(result.current[0].has(1)).toBe(false);
    expect(result.current[0].has(3)).toBe(true);

    await act(async () => {
      actions.reset();
      rerender();
    });

    expect(result.current[0].has(1)).toBe(true);
    expect(result.current[0].has(2)).toBe(true);
    expect(result.current[0].has(3)).toBe(false);
    expect(result.current[0].size).toBe(2);
  });

  it('should reset to empty Set when initialized with empty Set', async () => {
    const { result, rerender } = await renderHookSSR(() => useSet<number>());
    const [, actions] = result.current;

    await act(async () => {
      actions.add(1);
      actions.add(2);
      rerender();
    });

    expect(result.current[0].size).toBe(2);

    await act(async () => {
      actions.reset();
      rerender();
    });

    expect(result.current[0].size).toBe(0);
  });

  it('should create a new Set reference when values change', async () => {
    const { result, rerender } = await renderHookSSR(() => useSet<number>());
    const [originalSetRef, actions] = result.current;

    await act(async () => {
      actions.add(1);
      rerender();
    });

    expect(originalSetRef).not.toBe(result.current[0]);
    expect(originalSetRef.has(1)).toBe(false);
    expect(result.current[0].has(1)).toBe(true);
  });

  it('should maintain stable actions reference after Set changes', async () => {
    const { result, rerender } = await renderHookSSR(() => useSet<number>());
    const [, originalActionsRef] = result.current;

    expect(result.current[1]).toBe(originalActionsRef);

    await act(async () => {
      originalActionsRef.add(1);
      rerender();
    });

    expect(result.current[1]).toBe(originalActionsRef);
  });
});
