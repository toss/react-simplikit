import { useState } from 'react';

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

type UseListReturn<T> = { list: ReadonlyArray<T> } & ListActions<T>;

/**
 * @description
 * A React hook that manages an array as state.
 * Provides efficient state management and stable action functions.
 *
 * @template T - The type of the values held in the list.
 *
 * @param {T[]} [initialState=[]] - Initial array state.
 *
 * @returns {UseListReturn<T>} An object containing the array state and actions to manipulate it.
 * - list `ReadonlyArray<T>` - The current array state;
 * - push `(value: T) => void` - Appends a value to the end of the list;
 * - insertAt `(index: number, value: T) => void` - Inserts a value at the specified index;
 * - updateAt `(index: number, value: T) => void` - Updates the value at the specified index;
 * - removeAt `(index: number) => void` - Removes the value at the specified index;
 * - setAll `(values: T[]) => void` - Replaces the entire list with a new array;
 * - reset `() => void` - Resets the list to its initial state;
 *
 * @example
 * ```tsx
 * const { list, push, insertAt, updateAt, removeAt, setAll, reset } = useList<string>(['apple', 'banana']);
 *
 * // Add an item
 * push('cherry');
 *
 * // Insert at index
 * insertAt(1, 'grape');
 *
 * // Update at index
 * updateAt(0, 'orange');
 *
 * // Remove at index
 * removeAt(2);
 *
 * // Replace all
 * setAll(['kiwi', 'mango']);
 *
 * // Reset to initial state
 * reset();
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

  return { list, push, insertAt, updateAt, removeAt, setAll, reset };
}
