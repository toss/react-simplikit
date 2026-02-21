import { useCallback, useMemo, useState } from 'react';

import { usePreservedReference } from '../usePreservedReference/usePreservedReference.ts';

/**
 * Defines the type for either a Map or an array of key-value pairs.
 */
type MapOrEntries<K, V> = Map<K, V> | [K, V][];

/**
 * Actions to manipulate the Map state.
 */
type MapActions<K, V> = {
  /** Sets a key-value pair in the map. */
  set: (key: K, value: V) => void;
  /** Sets multiple key-value pairs in the map at once. */
  setAll: (entries: MapOrEntries<K, V>) => void;
  /** Removes a key from the map. */
  remove: (key: K) => void;
  /** Resets the map to its initial state. */
  reset: () => void;
};

/**
 * Return type of the useMap hook.
 * Hides certain methods to prevent direct mutations.
 */
type UseMapReturn<K, V> = [Omit<Map<K, V>, 'set' | 'clear' | 'delete'>, MapActions<K, V>];

/**
 * @description
 * A React hook that manages a key-value Map as state.
 * Provides efficient state management and stable action functions.
 *
 * @param {MapOrEntries<K, V>} initialState - Initial Map state (Map object or array of key-value pairs)
 * @returns {UseMapReturn<K, V>} A tuple containing the Map state and actions to manipulate it
 *
 * @example
 * ```tsx
 * const [userMap, actions] = useMap<string, User>([
 *   ['user1', { name: 'John', age: 30 }]
 * ]);
 *
 * // Using values from the Map
 * const user1 = userMap.get('user1');
 *
 * // Updating the Map
 * actions.set('user2', { name: 'Jane', age: 25 });
 * ```
 */
export function useMap<K, V>(initialState: MapOrEntries<K, V> = new Map()): UseMapReturn<K, V> {
  // Initialize Map state
  const [map, setMap] = useState(() => new Map(initialState));

  // Use usePreservedReference to maintain stable reference to initialState
  const preservedInitialState = usePreservedReference(initialState);

  const set = useCallback((key: K, value: V) => {
    setMap(prev => {
      const nextMap = new Map(prev);
      nextMap.set(key, value);
      return nextMap;
    });
  }, []);

  const setAll = useCallback((entries: MapOrEntries<K, V>) => {
    setMap(() => new Map(entries));
  }, []);

  const remove = useCallback((key: K) => {
    setMap(prev => {
      const nextMap = new Map(prev);
      nextMap.delete(key);
      return nextMap;
    });
  }, []);

  const reset = useCallback(() => {
    setMap(() => new Map(preservedInitialState));
  }, [preservedInitialState]);

  const actions = useMemo<MapActions<K, V>>(() => {
    return { set, setAll, remove, reset };
  }, [set, setAll, remove, reset]);

  return [map, actions];
}
