/* eslint-disable react-hooks/exhaustive-deps */
import { SetStateAction, useCallback, useRef, useSyncExternalStore } from 'react';

import { safeLocalStorage, Storage } from './storage.ts';

type ToObject<T> = T extends unknown[] | Record<string, unknown> ? T : never;

export type Serializable<T> = T extends string | number | boolean ? T : ToObject<T>;

type StorageStateOptions<T> = {
  storage?: Storage;
  defaultValue?: T;
};

type StorageStateOptionsWithDefaultValue<T> = StorageStateOptions<T> & {
  defaultValue: T;
};

type StorageStateOptionsWithSerializer<T> = StorageStateOptions<T> & {
  serializer: (value: Serializable<T>) => string;
  deserializer: (value: string) => Serializable<T>;
};

type StorageStateReturn<T> = {
  value: T;
  setValue: (value: SetStateAction<T>) => void;
  refresh: () => void;
};

type SerializableGuard<T extends { value: unknown }> = T['value'] extends any
  ? T
  : T['value'] extends never
    ? 'Received a non-serializable value'
    : T;

const listeners = new Set<() => void>();

const emitListeners = () => {
  listeners.forEach(listener => listener());
};

function isPlainObject(value: unknown): value is Record<PropertyKey, any> {
  if (typeof value !== 'object') {
    return false;
  }

  const proto = Object.getPrototypeOf(value) as typeof Object.prototype | null;

  const hasObjectPrototype = proto === Object.prototype;

  if (!hasObjectPrototype) {
    return false;
  }

  return Object.prototype.toString.call(value) === '[object Object]';
}

const ensureSerializable = <T extends { value: unknown }>(result: T): SerializableGuard<T> => {
  if (
    result.value != null &&
    !['string', 'number', 'boolean'].includes(typeof result.value) &&
    !(isPlainObject(result.value) || Array.isArray(result.value))
  ) {
    throw new Error('Received a non-serializable value');
  }

  return result as SerializableGuard<T>;
};

/**
 * @description
 * `useStorageState` is a React that functions like `useState` but persists the state value in browser storage.
 * The value is retained across page reloads and can be shared between tabs when using `localStorage`.
 *
 * @template T - The type of the stored value.
 * @param {string} key - The key used to store the value in storage.
 * @param {Object} [options] - Configuration options for storage behavior.
 * @param {Storage} [options.storage=localStorage] - The storage type (`localStorage` or `sessionStorage`). Defaults to `localStorage`.
 * @param {T} [options.defaultValue] - The initial value if no existing value is found.
 * @param {Function} [options.serializer] - A function to serialize the state value to a string.
 * @param {Function} [options.deserializer] - A function to deserialize the state value from a string.
 *
 * @returns {StorageStateReturn<Serializable<T> | undefined>} An object containing:
 * - value `Serializable<T> | undefined` - The current state value retrieved from storage;
 * - setValue `(value: SetStateAction<Serializable<T> | undefined>) => void` - Updates and persists the state;
 * - refresh `() => void` - Refreshes the state from storage;
 * @example
 * // Counter with persistent state
 * import { useStorageState } from 'react-simplikit';
 *
 * function Counter() {
 *   const { value: count, setValue: setCount } = useStorageState<number>('counter', {
 *     defaultValue: 0,
 *   });
 *
 *   return <button onClick={() => setCount(prev => prev + 1)}>Count: {count}</button>;
 * }
 */
export function useStorageState<T>(key: string): SerializableGuard<StorageStateReturn<Serializable<T> | undefined>>;
export function useStorageState<T>(
  key: string,
  options: StorageStateOptionsWithDefaultValue<T>
): SerializableGuard<StorageStateReturn<Serializable<T>>>;
export function useStorageState<T>(
  key: string,
  options: StorageStateOptions<T>
): SerializableGuard<StorageStateReturn<Serializable<T> | undefined>>;
export function useStorageState<T>(
  key: string,
  options: StorageStateOptionsWithSerializer<T>
): SerializableGuard<StorageStateReturn<Serializable<T> | undefined>>;
export function useStorageState<T>(
  key: string,
  {
    storage = safeLocalStorage,
    defaultValue,
    ...options
  }: StorageStateOptions<T> | StorageStateOptionsWithSerializer<T> = {}
): SerializableGuard<StorageStateReturn<Serializable<T> | undefined>> {
  // Without `'use no memo'`, React Compiler throws when `panicThreshold` is not `'none'`
  // because `cache.current` is read from `getSnapshot`, which `useSyncExternalStore` calls
  // during render. Belongs on this implementation signature — the overload declarations
  // above have no body to carry a directive.
  'use no memo';

  const serializedDefaultValue = defaultValue as Serializable<T>;
  const cache = useRef<{
    data: string | null;
    parsed: Serializable<T> | undefined;
  }>({
    data: null,
    parsed: serializedDefaultValue,
  });

  const getSnapshot = useCallback(() => {
    const deserializer = 'deserializer' in options ? options.deserializer : JSON.parse;
    const data = storage.get(key);

    if (data !== cache.current.data) {
      try {
        cache.current.parsed = data != null ? deserializer(data) : defaultValue;
      } catch {
        cache.current.parsed = serializedDefaultValue;
      }
      cache.current.data = data;
    }

    return cache.current.parsed;
  }, [defaultValue, key, storage]);

  const storageState = useSyncExternalStore<Serializable<T> | undefined>(
    onStoreChange => {
      listeners.add(onStoreChange);

      const handler = (event: StorageEvent) => {
        if (event.key == null || event.key === key) {
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
    () => serializedDefaultValue
  );

  const setStorageState = useCallback(
    (value: SetStateAction<Serializable<T> | undefined>) => {
      const serializer = 'serializer' in options ? options.serializer : JSON.stringify;

      const nextValue = typeof value === 'function' ? value(getSnapshot()) : value;

      if (nextValue == null) {
        storage.remove(key);
      } else {
        storage.set(key, serializer(nextValue));
      }
      emitListeners();
    },
    [getSnapshot, key, storage]
  );

  const refreshStorageState = useCallback(() => {
    setStorageState(getSnapshot());
  }, [storage, getSnapshot, setStorageState]);

  /* eslint-disable-next-line react-hooks/refs -- the two callbacks close over `cache` through
     `getSnapshot`, so the rule treats handing them to any function as a possible ref read
     during render. `ensureSerializable` only inspects `value` — `storageState`, a plain
     value — and never calls them; passing either callback alone reproduces the report. */
  return ensureSerializable({ value: storageState, setValue: setStorageState, refresh: refreshStorageState });
}
