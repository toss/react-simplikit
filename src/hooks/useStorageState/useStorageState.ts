import { SetStateAction, useCallback, useRef, useSyncExternalStore } from 'react';

import { safeLocalStorage, Storage } from './storage.ts';

type ToPrimitive<T> = T extends string ? string : T extends number ? number : T extends boolean ? boolean : never;
type ToObject<T> = T extends unknown[] | Record<string, unknown> ? T : never;

export type Serializable<T> = T extends string | number | boolean ? ToPrimitive<T> : ToObject<T>;

type StorageStateOptions<T> = {
  storage?: Storage;
  defaultValue?: Serializable<T>;
};

type StorageStateOptionsWithDefaultValue<T> = StorageStateOptions<T> & {
  defaultValue: Serializable<T>;
};

const listeners = new Set<() => void>();

const emitListeners = () => {
  listeners.forEach(listener => listener());
};

/**
 * @description
 * A React hook that functions like `useState` but persists the state value in browser storage.
 * The value is retained across page reloads and can be shared between tabs when using `localStorage`.
 *
 * @param {string} key - The key used to store the value in storage.
 * @param {object} [options] - Configuration options for storage behavior.
 * @param {Storage} [options.storage=localStorage] - The storage type (`localStorage` or `sessionStorage`). Defaults to `localStorage`.
 * @param {T} [options.defaultValue] - The initial value if no existing value is found.
 *
 * @returns {[state: Serializable<T> | undefined, setState: (value: SetStateAction<Serializable<T> | undefined>) => void]} A tuple:
 * - state `Serializable<T> | undefined` - The current state value retrieved from storage;
 * - setState `(value: SetStateAction<Serializable<T> | undefined>) => void` - A function to update and persist the state;
 *
 * @example
 * // Counter with persistent state
 * import { useStorageState } from 'react-simplikit';
 *
 * function Counter() {
 *   const [count, setCount] = useStorageState<number>('counter', {
 *     defaultValue: 0,
 *   });
 *
 *   return <button onClick={() => setCount(prev => prev + 1)}>Count: {count}</button>;
 * }
 */
export function useStorageState<T>(
  key: string
): readonly [Serializable<T> | undefined, (value: SetStateAction<Serializable<T> | undefined>) => void];
export function useStorageState<T>(
  key: string,
  { storage, defaultValue }: StorageStateOptionsWithDefaultValue<T>
): readonly [Serializable<T>, (value: SetStateAction<Serializable<T>>) => void];
export function useStorageState<T>(
  key: string,
  { storage, defaultValue }: StorageStateOptions<T>
): readonly [Serializable<T> | undefined, (value: SetStateAction<Serializable<T> | undefined>) => void];
export function useStorageState<T>(
  key: string,
  { storage = safeLocalStorage, defaultValue }: StorageStateOptions<T> = {}
): readonly [Serializable<T> | undefined, (value: SetStateAction<Serializable<T> | undefined>) => void] {
  const cache = useRef<{
    data: string | null;
    parsed: Serializable<T> | undefined;
  }>({
    data: null,
    parsed: defaultValue,
  });

  const getSnapshot = useCallback(() => {
    const data = storage.get(key);

    if (data !== cache.current.data) {
      try {
        cache.current.parsed = data != null ? JSON.parse(data) : defaultValue;
      } catch {
        cache.current.parsed = defaultValue;
      }
      cache.current.data = data;
    }

    return cache.current.parsed;
  }, [defaultValue, key, storage]);

  const storageState = useSyncExternalStore<Serializable<T> | undefined>(
    onStoreChange => {
      listeners.add(onStoreChange);

      const handler = (event: StorageEvent) => {
        if (event.key === key) {
          onStoreChange();
        }
      };

      window.addEventListener('storage', handler);

      return () => {
        listeners.delete(onStoreChange);
        window.removeEventListener('storage', handler);
      };
    },
    () => getSnapshot(),
    () => defaultValue
  );

  const setStorageState = useCallback(
    (value: SetStateAction<Serializable<T> | undefined>) => {
      const nextValue = typeof value === 'function' ? value(getSnapshot()) : value;

      if (nextValue == null) {
        storage.remove(key);
      } else {
        storage.set(key, JSON.stringify(nextValue));
      }
      emitListeners();
    },
    [getSnapshot, key, storage]
  );

  return [storageState, setStorageState] as const;
}
