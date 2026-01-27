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

type SerializableGuard<T extends readonly any[]> = T[0] extends any
  ? T
  : T[0] extends never
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

const ensureSerializable = <T extends readonly any[]>(value: T): SerializableGuard<T> => {
  if (
    value[0] != null &&
    !['string', 'number', 'boolean'].includes(typeof value[0]) &&
    !(isPlainObject(value[0]) || Array.isArray(value[0]))
  ) {
    throw new Error('Received a non-serializable value');
  }

  return value as SerializableGuard<T>;
};

/**
 * @deprecated This hook is deprecated as it depends on browser-specific APIs (localStorage/sessionStorage).
 * react-simplikit is now focused on platform-independent, pure state/logic hooks.
 * This hook will be removed in a future major version.
 *
 * @description
 * `useStorageState` is a React that functions like `useState` but persists the state value in browser storage.
 * The value is retained across page reloads and can be shared between tabs when using `localStorage`.
 *
 * @param {string} key - The key used to store the value in storage.
 * @param {Object} [options] - Configuration options for storage behavior.
 * @param {Storage} [options.storage=localStorage] - The storage type (`localStorage` or `sessionStorage`). Defaults to `localStorage`.
 * @param {T} [options.defaultValue] - The initial value if no existing value is found.
 * @param {Function} [options.serializer] - A function to serialize the state value to a string.
 * @param {Function} [options.deserializer] - A function to deserialize the state value from a string.
 *
 * @returns {readonly [state: Serializable<T> | undefined, setState: (value: SetStateAction<Serializable<T> | undefined>) => void, refreshState: () => void]} A tuple:
 * - state `Serializable<T> | undefined` - The current state value retrieved from storage;
 * - setState `(value: SetStateAction<Serializable<T> | undefined>) => void` - A function to update and persist the state;
 * - refreshState `() => void` - A function to refresh the state from storage;
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
): SerializableGuard<
  readonly [Serializable<T> | undefined, (value: SetStateAction<Serializable<T> | undefined>) => void, () => void]
>;
export function useStorageState<T>(
  key: string,
  options: StorageStateOptionsWithDefaultValue<T>
): SerializableGuard<readonly [Serializable<T>, (value: SetStateAction<Serializable<T>>) => void, () => void]>;
export function useStorageState<T>(
  key: string,
  options: StorageStateOptions<T>
): SerializableGuard<
  readonly [Serializable<T> | undefined, (value: SetStateAction<Serializable<T> | undefined>) => void, () => void]
>;
export function useStorageState<T>(
  key: string,
  options: StorageStateOptionsWithSerializer<T>
): SerializableGuard<
  readonly [Serializable<T> | undefined, (value: SetStateAction<Serializable<T> | undefined>) => void, () => void]
>;
export function useStorageState<T>(
  key: string,
  {
    storage = safeLocalStorage,
    defaultValue,
    ...options
  }: StorageStateOptions<T> | StorageStateOptionsWithSerializer<T> = {}
): SerializableGuard<
  readonly [Serializable<T> | undefined, (value: SetStateAction<Serializable<T> | undefined>) => void, () => void]
> {
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

  return ensureSerializable([storageState, setStorageState, refreshStorageState] as const);
}
