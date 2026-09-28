import { useState } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';
import { usePreservedReference } from '../usePreservedReference/usePreservedReference.ts';

type SetOrValues<T> = Set<T> | T[];

type SetActions<T> = {
  add: (value: T) => void;
  remove: (value: T) => void;
  toggle: (value: T) => void;
  setAll: (values: SetOrValues<T>) => void;
  reset: () => void;
};

type UseSetReturn<T> = { set: Omit<Set<T>, 'add' | 'clear' | 'delete'> } & SetActions<T>;

/**
 * @description
 * A React hook that manages a Set as state.
 * Provides efficient state management and stable action functions.
 *
 * @template T - The type of the values held in the set.
 *
 * @param {SetOrValues<T>} [initialState=new Set()] - Initial Set state (Set object or array of values).
 *
 * @returns {UseSetReturn<T>} An object containing the Set state and actions to manipulate it.
 * - set `Omit<Set<T>, 'add' | 'clear' | 'delete'>` - The current Set state with mutation methods hidden;
 * - add `(value: T) => void` - Adds a value to the set;
 * - remove `(value: T) => void` - Removes a value from the set;
 * - toggle `(value: T) => void` - Adds the value if absent, removes it if present;
 * - setAll `(values: Set<T> | T[]) => void` - Replaces all values in the set;
 * - reset `() => void` - Resets the set to its initial state;
 *
 * @example
 * ```tsx
 * import { useSet } from 'react-simplikit';
 *
 * function TagSelector() {
 *   const { set: selectedTags, add, remove, toggle } = useSet<string>(['react']);
 *
 *   return (
 *     <div>
 *       {['react', 'vue', 'svelte'].map(tag => (
 *         <button key={tag} onClick={() => toggle(tag)}>
 *           {selectedTags.has(tag) ? '✓' : ''} {tag}
 *         </button>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useSet<T>(initialState: SetOrValues<T> = new Set()): UseSetReturn<T> {
  const [set, setSet] = useState(() => new Set(initialState));

  const preservedInitialState = usePreservedReference(initialState);

  const add = usePreservedCallback((value: T) => {
    setSet(prev => {
      const nextSet = new Set(prev);
      nextSet.add(value);
      return nextSet;
    });
  });

  const remove = usePreservedCallback((value: T) => {
    setSet(prev => {
      const nextSet = new Set(prev);
      nextSet.delete(value);
      return nextSet;
    });
  });

  const toggle = usePreservedCallback((value: T) => {
    setSet(prev => {
      const nextSet = new Set(prev);
      if (nextSet.has(value)) {
        nextSet.delete(value);
      } else {
        nextSet.add(value);
      }
      return nextSet;
    });
  });

  const setAll = usePreservedCallback((values: SetOrValues<T>) => {
    setSet(() => new Set(values));
  });

  const reset = usePreservedCallback(() => {
    setSet(() => new Set(preservedInitialState));
  });

  return { set, add, remove, toggle, setAll, reset };
}
