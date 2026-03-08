import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useHistory } from './useHistory.ts';

describe('useHistory', () => {
  it('is safe on server side rendering', async () => {
    const result = renderHookSSR.serverOnly(() => useHistory('initial'));

    expect(result.current.value).toBe('initial');
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
    expect(result.current.pointer).toBe(0);
    expect(result.current.history).toEqual(['initial']);
  });

  it('should initialize with the given value', async () => {
    const { result } = await renderHookSSR(() => useHistory(0));

    expect(result.current.value).toBe(0);
    expect(result.current.pointer).toBe(0);
    expect(result.current.history).toEqual([0]);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it('should record value changes in history', async () => {
    const { result } = await renderHookSSR(() => useHistory('a'));

    await act(async () => {
      result.current.setValue('b');
    });

    await act(async () => {
      result.current.setValue('c');
    });

    expect(result.current.value).toBe('c');
    expect(result.current.history).toEqual(['a', 'b', 'c']);
    expect(result.current.pointer).toBe(2);
  });

  it('should undo to the previous value', async () => {
    const { result } = await renderHookSSR(() => useHistory(0));

    await act(async () => {
      result.current.setValue(1);
    });

    await act(async () => {
      result.current.setValue(2);
    });

    await act(async () => {
      result.current.undo();
    });

    expect(result.current.value).toBe(1);
    expect(result.current.pointer).toBe(1);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(true);
  });

  it('should redo to the next value', async () => {
    const { result } = await renderHookSSR(() => useHistory(0));

    await act(async () => {
      result.current.setValue(1);
    });

    await act(async () => {
      result.current.setValue(2);
    });

    await act(async () => {
      result.current.undo();
    });

    await act(async () => {
      result.current.undo();
    });

    await act(async () => {
      result.current.redo();
    });

    expect(result.current.value).toBe(1);
    expect(result.current.pointer).toBe(1);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(true);
  });

  it('should not undo past the initial value', async () => {
    const { result } = await renderHookSSR(() => useHistory(0));

    await act(async () => {
      result.current.undo();
    });

    expect(result.current.value).toBe(0);
    expect(result.current.pointer).toBe(0);
    expect(result.current.canUndo).toBe(false);
  });

  it('should not redo past the latest value', async () => {
    const { result } = await renderHookSSR(() => useHistory(0));

    await act(async () => {
      result.current.setValue(1);
    });

    await act(async () => {
      result.current.redo();
    });

    expect(result.current.value).toBe(1);
    expect(result.current.pointer).toBe(1);
    expect(result.current.canRedo).toBe(false);
  });

  it('should discard future history when setting a new value after undo', async () => {
    const { result } = await renderHookSSR(() => useHistory(0));

    await act(async () => {
      result.current.setValue(1);
    });

    await act(async () => {
      result.current.setValue(2);
    });

    await act(async () => {
      result.current.undo();
    });

    await act(async () => {
      result.current.setValue(3);
    });

    expect(result.current.value).toBe(3);
    expect(result.current.history).toEqual([0, 1, 3]);
    expect(result.current.pointer).toBe(2);
    expect(result.current.canRedo).toBe(false);
  });

  it('should limit history to the given capacity', async () => {
    const { result } = await renderHookSSR(() => useHistory(0, { capacity: 3 }));

    await act(async () => {
      result.current.setValue(1);
    });

    await act(async () => {
      result.current.setValue(2);
    });

    await act(async () => {
      result.current.setValue(3);
    });

    await act(async () => {
      result.current.setValue(4);
    });

    expect(result.current.history).toEqual([2, 3, 4]);
    expect(result.current.history).toHaveLength(3);
    expect(result.current.value).toBe(4);
    expect(result.current.pointer).toBe(2);
  });

  it('should clear history and keep the current value', async () => {
    const { result } = await renderHookSSR(() => useHistory(0));

    await act(async () => {
      result.current.setValue(1);
    });

    await act(async () => {
      result.current.setValue(2);
    });

    await act(async () => {
      result.current.clear();
    });

    expect(result.current.value).toBe(2);
    expect(result.current.history).toEqual([2]);
    expect(result.current.pointer).toBe(0);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it('should handle consecutive setValue calls within a single act', async () => {
    const { result } = await renderHookSSR(() => useHistory(0));

    await act(async () => {
      result.current.setValue(1);
      result.current.setValue(2);
    });

    expect(result.current.value).toBe(2);
    expect(result.current.history).toEqual([0, 1, 2]);
    expect(result.current.pointer).toBe(2);
  });

  it('should keep only one entry when capacity is 1', async () => {
    const { result } = await renderHookSSR(() => useHistory(0, { capacity: 1 }));

    await act(async () => {
      result.current.setValue(1);
    });

    await act(async () => {
      result.current.setValue(2);
    });

    expect(result.current.history).toEqual([2]);
    expect(result.current.history).toHaveLength(1);
    expect(result.current.value).toBe(2);
    expect(result.current.canUndo).toBe(false);
  });

  it('should clear history after undo and keep the undone value', async () => {
    const { result } = await renderHookSSR(() => useHistory(0));

    await act(async () => {
      result.current.setValue(1);
    });

    await act(async () => {
      result.current.setValue(2);
    });

    await act(async () => {
      result.current.undo();
    });

    await act(async () => {
      result.current.clear();
    });

    expect(result.current.value).toBe(1);
    expect(result.current.history).toEqual([1]);
    expect(result.current.pointer).toBe(0);
  });
});
