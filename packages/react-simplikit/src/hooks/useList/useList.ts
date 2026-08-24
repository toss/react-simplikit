import { useMemo, useState } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';
import { usePreservedReference } from '../usePreservedReference/usePreservedReference.ts';

type ListActions<T> = {
  push: (value: T) => void;
  insertAt: (index: number, value: T) => void;
  updateAt: (index: number, value: T) => void;
  removeAt: (index: number) => void;
  setAll: (values: T[]) => void;
  reset: () => void;
};

type UseListReturn<T> = [ReadonlyArray<T>, ListActions<T>];

/**
 * @description
 * A React hook that manages an array as state.
 * Provides efficient state management and stable action functions.
 *
 * @param {T[]} initialState - Initial array state
 *
 * @returns {UseListReturn<T>} A tuple containing the array state and actions to manipulate it
 * - `push` - Appends a value to the end of the list
 * - `insertAt` - Inserts a value at the specified index
 * - `updateAt` - Updates the value at the specified index
 * - `removeAt` - Removes the value at the specified index
 * - `setAll` - Replaces the entire list with a new array
 * - `reset` - Resets the list to its initial state
 *
 * @example
 * ```tsx
 * const [list, actions] = useList<string>(['apple', 'banana']);
 *
 * // Add an item
 * actions.push('cherry');
 *
 * // Insert at index
 * actions.insertAt(1, 'grape');
 *
 * // Update at index
 * actions.updateAt(0, 'orange');
 *
 * // Remove at index
 * actions.removeAt(2);
 *
 * // Replace all
 * actions.setAll(['kiwi', 'mango']);
 *
 * // Reset to initial state
 * actions.reset();
 * ```
 */
export function useList<T>(initialState: T[] = []): UseListReturn<T> {
  const [list, setList] = useState(initialState);

  const preservedInitialState = usePreservedReference(initialState);

  const push = usePreservedCallback((value: T) => {
    setList(prev => [...prev, value]);
  });

  const insertAt = usePreservedCallback((index: number, value: T) => {
    setList(prev => {
      const next = [...prev];
      next.splice(index, 0, value);
      return next;
    });
  });

  const updateAt = usePreservedCallback((index: number, value: T) => {
    setList(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  });

  const removeAt = usePreservedCallback((index: number) => {
    setList(prev => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  });

  const setAll = usePreservedCallback((values: T[]) => {
    setList(values);
  });

  const reset = usePreservedCallback(() => {
    setList(preservedInitialState);
  });

  const actions = useMemo<ListActions<T>>(
    () => ({ push, insertAt, updateAt, removeAt, setAll, reset }),
    [push, insertAt, updateAt, removeAt, setAll, reset]
  );

  return [list, actions];
}
