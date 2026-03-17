import { useMemo, useState } from 'react';

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

type UseSetReturn<T> = [Omit<Set<T>, 'add' | 'clear' | 'delete'>, SetActions<T>];

/**
 * @description
 * A React hook that manages a Set as state.
 * Provides efficient state management and stable action functions.
 *
 * @param {SetOrValues<T>} initialState - Initial Set state (Set object or array of values)
 * @returns {UseSetReturn<T>} A tuple containing the Set state and actions to manipulate it
 *
 * @example
 * ```tsx
 * import { useSet } from 'react-simplikit';
 *
 * function TagSelector() {
 *   const [selectedTags, { add, remove, toggle }] = useSet<string>(['react']);
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

  const actions = useMemo<SetActions<T>>(
    () => ({ add, remove, toggle, setAll, reset }),
    [add, remove, toggle, setAll, reset]
  );

  return [set, actions];
}
