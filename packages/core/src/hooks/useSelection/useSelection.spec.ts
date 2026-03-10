import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useSelection } from './useSelection.ts';

describe('useSelection', () => {
  it('is safe in server-side rendering', () => {
    renderHookSSR.serverOnly(() => useSelection(['a', 'b', 'c']));
  });

  it('should initialize with empty selection', async () => {
    const { result } = await renderHookSSR(() => useSelection(['a', 'b', 'c']));

    expect(result.current.selected).toEqual([]);
    expect(result.current.isAllSelected).toBe(false);
    expect(result.current.isSomeSelected).toBe(false);
  });

  it('should initialize with defaultSelected', async () => {
    const { result } = await renderHookSSR(() => useSelection(['a', 'b', 'c'], { defaultSelected: ['a', 'b'] }));

    expect(result.current.selected).toEqual(['a', 'b']);
    expect(result.current.isAllSelected).toBe(false);
    expect(result.current.isSomeSelected).toBe(true);
  });

  it('should ignore defaultSelected values not in items', async () => {
    const { result } = await renderHookSSR(() => useSelection(['a', 'b'], { defaultSelected: ['a', 'z'] }));

    expect(result.current.selected).toEqual(['a']);
  });

  it('should select a single item', async () => {
    const { result, rerender } = await renderHookSSR(() => useSelection(['a', 'b', 'c']));

    await act(async () => {
      result.current.select('a');
      rerender();
    });

    expect(result.current.selected).toEqual(['a']);
    expect(result.current.isSelected('a')).toBe(true);
  });

  it('should be no-op when selecting an already selected item', async () => {
    const { result, rerender } = await renderHookSSR(() => useSelection(['a', 'b'], { defaultSelected: ['a'] }));

    const prevSelected = result.current.selected;

    await act(async () => {
      result.current.select('a');
      rerender();
    });

    expect(result.current.selected).toBe(prevSelected);
  });

  it('should deselect an item', async () => {
    const { result, rerender } = await renderHookSSR(() =>
      useSelection(['a', 'b', 'c'], { defaultSelected: ['a', 'b'] })
    );

    await act(async () => {
      result.current.deselect('a');
      rerender();
    });

    expect(result.current.selected).toEqual(['b']);
    expect(result.current.isSelected('a')).toBe(false);
  });

  it('should be no-op when deselecting a non-selected item', async () => {
    const { result, rerender } = await renderHookSSR(() => useSelection(['a', 'b']));

    const prevSelected = result.current.selected;

    await act(async () => {
      result.current.deselect('a');
      rerender();
    });

    expect(result.current.selected).toBe(prevSelected);
  });

  it('should toggle an item on', async () => {
    const { result, rerender } = await renderHookSSR(() => useSelection(['a', 'b', 'c']));

    await act(async () => {
      result.current.toggle('b');
      rerender();
    });

    expect(result.current.isSelected('b')).toBe(true);
  });

  it('should toggle an item off', async () => {
    const { result, rerender } = await renderHookSSR(() => useSelection(['a', 'b', 'c'], { defaultSelected: ['b'] }));

    await act(async () => {
      result.current.toggle('b');
      rerender();
    });

    expect(result.current.isSelected('b')).toBe(false);
  });

  it('should return true from isSelected for a selected item', async () => {
    const { result } = await renderHookSSR(() => useSelection(['a', 'b'], { defaultSelected: ['a'] }));

    expect(result.current.isSelected('a')).toBe(true);
    expect(result.current.isSelected('b')).toBe(false);
  });

  it('should select all items', async () => {
    const { result, rerender } = await renderHookSSR(() => useSelection(['a', 'b', 'c']));

    await act(async () => {
      result.current.selectAll();
      rerender();
    });

    expect(result.current.selected).toEqual(['a', 'b', 'c']);
    expect(result.current.isAllSelected).toBe(true);
    expect(result.current.isSomeSelected).toBe(false);
  });

  it('should deselect all items', async () => {
    const { result, rerender } = await renderHookSSR(() =>
      useSelection(['a', 'b', 'c'], { defaultSelected: ['a', 'b', 'c'] })
    );

    await act(async () => {
      result.current.deselectAll();
      rerender();
    });

    expect(result.current.selected).toEqual([]);
    expect(result.current.isAllSelected).toBe(false);
    expect(result.current.isSomeSelected).toBe(false);
  });

  it('should toggleAll from all selected to none', async () => {
    const { result, rerender } = await renderHookSSR(() =>
      useSelection(['a', 'b', 'c'], { defaultSelected: ['a', 'b', 'c'] })
    );

    expect(result.current.isAllSelected).toBe(true);

    await act(async () => {
      result.current.toggleAll();
      rerender();
    });

    expect(result.current.selected).toEqual([]);
    expect(result.current.isAllSelected).toBe(false);
  });

  it('should toggleAll from partial selection to all selected', async () => {
    const { result, rerender } = await renderHookSSR(() => useSelection(['a', 'b', 'c'], { defaultSelected: ['a'] }));

    expect(result.current.isSomeSelected).toBe(true);

    await act(async () => {
      result.current.toggleAll();
      rerender();
    });

    expect(result.current.selected).toEqual(['a', 'b', 'c']);
    expect(result.current.isAllSelected).toBe(true);
  });

  it('should toggleAll from none selected to all selected', async () => {
    const { result, rerender } = await renderHookSSR(() => useSelection(['a', 'b', 'c']));

    await act(async () => {
      result.current.toggleAll();
      rerender();
    });

    expect(result.current.selected).toEqual(['a', 'b', 'c']);
    expect(result.current.isAllSelected).toBe(true);
  });

  it('should set isAllSelected to true when all items are selected', async () => {
    const { result, rerender } = await renderHookSSR(() => useSelection(['a', 'b']));

    await act(async () => {
      result.current.selectAll();
      rerender();
    });

    expect(result.current.isAllSelected).toBe(true);
  });

  it('should set isAllSelected to false when not all items are selected', async () => {
    const { result, rerender } = await renderHookSSR(() => useSelection(['a', 'b'], { defaultSelected: ['a'] }));

    expect(result.current.isAllSelected).toBe(false);

    await act(async () => {
      result.current.deselect('a');
      rerender();
    });

    expect(result.current.isAllSelected).toBe(false);
  });

  it('should set isSomeSelected to true when partial selection', async () => {
    const { result } = await renderHookSSR(() => useSelection(['a', 'b', 'c'], { defaultSelected: ['a'] }));

    expect(result.current.isSomeSelected).toBe(true);
  });

  it('should set isSomeSelected to false when none are selected', async () => {
    const { result } = await renderHookSSR(() => useSelection(['a', 'b', 'c']));

    expect(result.current.isSomeSelected).toBe(false);
  });

  it('should set isSomeSelected to false when all are selected', async () => {
    const { result } = await renderHookSSR(() => useSelection(['a', 'b', 'c'], { defaultSelected: ['a', 'b', 'c'] }));

    expect(result.current.isSomeSelected).toBe(false);
  });

  it('should remove selected items that are no longer in items when items change', async () => {
    let items = ['a', 'b', 'c'];
    const { result, rerender } = await renderHookSSR(() => useSelection(items, { defaultSelected: ['a', 'b', 'c'] }));

    expect(result.current.selected).toEqual(['a', 'b', 'c']);

    await act(async () => {
      items = ['a', 'b'];
      rerender();
    });

    expect(result.current.selected).toEqual(['a', 'b']);
  });

  it('should ignore select for values not in items', async () => {
    const { result, rerender } = await renderHookSSR(() => useSelection(['a', 'b']));

    await act(async () => {
      result.current.select('z');
      rerender();
    });

    expect(result.current.selected).toEqual([]);
  });

  it('should ignore toggle for values not in items', async () => {
    const { result, rerender } = await renderHookSSR(() => useSelection(['a', 'b']));

    await act(async () => {
      result.current.toggle('z');
      rerender();
    });

    expect(result.current.selected).toEqual([]);
  });

  it('should handle selectAll and toggleAll on empty items', async () => {
    const { result, rerender } = await renderHookSSR(() => useSelection([]));

    await act(async () => {
      result.current.selectAll();
      rerender();
    });

    expect(result.current.selected).toEqual([]);
    expect(result.current.isAllSelected).toBe(false);

    await act(async () => {
      result.current.toggleAll();
      rerender();
    });

    expect(result.current.selected).toEqual([]);
    expect(result.current.isAllSelected).toBe(false);
  });

  it('should update isAllSelected and isSomeSelected when items change', async () => {
    let items = ['a', 'b'];
    const { result, rerender } = await renderHookSSR(() => useSelection(items, { defaultSelected: ['a', 'b'] }));

    expect(result.current.isAllSelected).toBe(true);
    expect(result.current.isSomeSelected).toBe(false);

    await act(async () => {
      items = ['a', 'b', 'c'];
      rerender();
    });

    expect(result.current.isAllSelected).toBe(false);
    expect(result.current.isSomeSelected).toBe(true);
  });

  it('should set isAllSelected to false when items list is empty', async () => {
    const { result } = await renderHookSSR(() => useSelection([]));

    expect(result.current.isAllSelected).toBe(false);
  });

  it('should maintain stable action references across rerenders', async () => {
    const { result, rerender } = await renderHookSSR(() => useSelection(['a', 'b', 'c']));

    const { select, deselect, toggle, isSelected, selectAll, deselectAll, toggleAll } = result.current;

    await act(async () => {
      result.current.select('a');
      rerender();
    });

    expect(result.current.select).toBe(select);
    expect(result.current.deselect).toBe(deselect);
    expect(result.current.toggle).toBe(toggle);
    expect(result.current.isSelected).toBe(isSelected);
    expect(result.current.selectAll).toBe(selectAll);
    expect(result.current.deselectAll).toBe(deselectAll);
    expect(result.current.toggleAll).toBe(toggleAll);
  });
});
