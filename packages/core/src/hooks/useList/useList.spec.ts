import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useList } from './useList.ts';

describe('useList', () => {
  it('is safe on server side rendering', () => {
    const result = renderHookSSR.serverOnly(() => useList(['a', 'b']));

    expect(result.current[0]).toEqual(['a', 'b']);
  });

  it('should initialize with an array', async () => {
    const { result } = await renderHookSSR(() => useList(['a', 'b']));

    expect(result.current[0]).toEqual(['a', 'b']);
  });

  it('should initialize with an empty array when no arguments provided', async () => {
    const { result } = await renderHookSSR(() => useList());

    expect(result.current[0]).toEqual([]);
  });

  it('should push a value to the end of the list', async () => {
    const { result, rerender } = await renderHookSSR(() => useList(['a']));
    const [, actions] = result.current;

    await act(async () => {
      actions.push('b');
      rerender();
    });

    expect(result.current[0]).toEqual(['a', 'b']);
  });

  it('should insert a value at the specified index', async () => {
    const { result, rerender } = await renderHookSSR(() => useList(['a', 'c']));
    const [, actions] = result.current;

    await act(async () => {
      actions.insertAt(1, 'b');
      rerender();
    });

    expect(result.current[0]).toEqual(['a', 'b', 'c']);
  });

  it('should insert at the beginning when index is 0', async () => {
    const { result, rerender } = await renderHookSSR(() => useList(['b', 'c']));
    const [, actions] = result.current;

    await act(async () => {
      actions.insertAt(0, 'a');
      rerender();
    });

    expect(result.current[0]).toEqual(['a', 'b', 'c']);
  });

  it('should update a value at the specified index', async () => {
    const { result, rerender } = await renderHookSSR(() => useList(['a', 'b', 'c']));
    const [, actions] = result.current;

    await act(async () => {
      actions.updateAt(1, 'x');
      rerender();
    });

    expect(result.current[0]).toEqual(['a', 'x', 'c']);
  });

  it('should remove a value at the specified index', async () => {
    const { result, rerender } = await renderHookSSR(() => useList(['a', 'b', 'c']));
    const [, actions] = result.current;

    await act(async () => {
      actions.removeAt(1);
      rerender();
    });

    expect(result.current[0]).toEqual(['a', 'c']);
  });

  it('should remove the first item', async () => {
    const { result, rerender } = await renderHookSSR(() => useList(['a', 'b', 'c']));
    const [, actions] = result.current;

    await act(async () => {
      actions.removeAt(0);
      rerender();
    });

    expect(result.current[0]).toEqual(['b', 'c']);
  });

  it('should remove the last item', async () => {
    const { result, rerender } = await renderHookSSR(() => useList(['a', 'b', 'c']));
    const [, actions] = result.current;

    await act(async () => {
      actions.removeAt(2);
      rerender();
    });

    expect(result.current[0]).toEqual(['a', 'b']);
  });

  it('should replace all values with setAll', async () => {
    const { result, rerender } = await renderHookSSR(() => useList(['a', 'b']));
    const [, actions] = result.current;

    await act(async () => {
      actions.setAll(['x', 'y', 'z']);
      rerender();
    });

    expect(result.current[0]).toEqual(['x', 'y', 'z']);
  });

  it('should reset the list to its initial state', async () => {
    const { result, rerender } = await renderHookSSR(() => useList(['a', 'b']));
    const [, actions] = result.current;

    await act(async () => {
      actions.push('c');
      actions.removeAt(0);
      rerender();
    });

    expect(result.current[0]).not.toEqual(['a', 'b']);

    await act(async () => {
      actions.reset();
      rerender();
    });

    expect(result.current[0]).toEqual(['a', 'b']);
  });

  it('should reset to empty array when initialized with empty array', async () => {
    const { result, rerender } = await renderHookSSR(() => useList<string>());
    const [, actions] = result.current;

    await act(async () => {
      actions.push('a');
      actions.push('b');
      rerender();
    });

    expect(result.current[0]).toEqual(['a', 'b']);

    await act(async () => {
      actions.reset();
      rerender();
    });

    expect(result.current[0]).toEqual([]);
  });

  it('should create a new array reference when values change', async () => {
    const { result, rerender } = await renderHookSSR(() => useList(['a']));
    const [originalRef] = result.current;

    await act(async () => {
      result.current[1].push('b');
      rerender();
    });

    expect(originalRef).not.toBe(result.current[0]);
  });

  it('should maintain stable actions reference after list changes', async () => {
    const { result, rerender } = await renderHookSSR(() => useList<string>());
    const [, originalActions] = result.current;

    expect(result.current[1]).toBe(originalActions);

    await act(async () => {
      originalActions.push('a');
      rerender();
    });

    expect(result.current[1]).toBe(originalActions);
  });
});
