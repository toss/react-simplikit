import { SetStateAction, useInsertionEffect, useMemo, useRef, useSyncExternalStore } from 'react';

import { safeLocalStorage, Storage } from './storage.ts';

type StorageStateOptions<T> = {
  storage?: Storage;
  defaultValue?: T;
};

type StorageStateCodec<T> = {
  serializer: (value: T) => string;
  deserializer: (value: string) => T;
};

/** Rejects a lone `serializer` or `deserializer`, which would write and read in different formats. */
type WithoutCodec = {
  serializer?: never;
  deserializer?: never;
};

type StorageStateActions<V> = {
  setValue: (value: SetStateAction<V>) => void;
  refresh: () => void;
};

type StorageStateResult<V> = readonly [V, StorageStateActions<V>];

const listeners = new Set<() => void>();

const emitListeners = () => {
  listeners.forEach(listener => listener());
};

function isUpdater<V>(value: SetStateAction<V>): value is (prevState: V) => V {
  return typeof value === 'function';
}

function isPlainObject(value: object): boolean {
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Returns the path to the first value that would not survive `JSON.stringify` and `JSON.parse` unchanged, or `null`.
 * `undefined` is allowed only as an object property, which JSON drops just like a missing key.
 * The path is built only on failure, so a valid value costs one walk with no string work.
 */
function findNonJsonPath(value: unknown): Array<string | number> | null {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') {
    return null;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? null : [];
  }

  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index++) {
      const path = findNonJsonPath(value[index]);
      if (path !== null) {
        return [index, ...path];
      }
    }
    return null;
  }

  if (typeof value === 'object' && isPlainObject(value)) {
    for (const [key, item] of Object.entries(value)) {
      const path = item === undefined ? null : findNonJsonPath(item);
      if (path !== null) {
        return [key, ...path];
      }
    }
    return null;
  }

  return [];
}

function assertJson(value: unknown, name: string): void {
  const path = findNonJsonPath(value);

  if (path !== null) {
    const location = path.map(part => (typeof part === 'number' ? `[${part}]` : `.${part}`)).join('');
    throw new Error(`${name}${location} is not JSON-serializable. Pass serializer and deserializer.`);
  }
}

/**
 * @description
 * `useStorageState` is a React hook that functions like `useState` but persists the state value in browser storage.
 * The value is retained across page reloads and can be shared between tabs when using `localStorage`.
 *
 * Without `serializer` and `deserializer`, the value is stored as JSON and must be JSON-serializable all the way down:
 * a `Date`, `Map`, class instance or function anywhere in it throws when it is set, and `defaultValue` is checked on mount.
 * Pass both functions to store any other type. The stored string is not validated when it is read back.
 *
 * @template T - The type of the stored value.
 * @param {string} key - The key used to store the value in storage.
 * @param {Object} [options] - Configuration options for storage behavior.
 * @param {Storage} [options.storage=localStorage] - The storage type (`localStorage` or `sessionStorage`). Defaults to `localStorage`.
 * @param {T} [options.defaultValue] - The initial value if no existing value is found.
 * @param {(value: T) => string} [options.serializer] - Converts the value to a string. Pass it together with `deserializer`.
 * @param {(value: string) => T} [options.deserializer] - Converts the stored string back to a value. Pass it together with `serializer`.
 *
 * @returns {readonly [state: T | undefined, actions: StorageStateActions<T | undefined>]} A tuple containing the state and actions to change it.
 * - state `T | undefined` - The current state value retrieved from storage. It is `T` when `defaultValue` is given;
 * - actions.setValue `(value: SetStateAction<T | undefined>) => void` - A function to update and persist the state;
 * - actions.refresh `() => void` - A function to refresh the state from storage;
 * @example
 * // Counter with persistent state
 * import { useStorageState } from 'react-simplikit';
 *
 * function Counter() {
 *   const [count, { setValue }] = useStorageState('counter', {
 *     defaultValue: 0,
 *   });
 *
 *   return <button onClick={() => setValue(prev => prev + 1)}>Count: {count}</button>;
 * }
 */
export function useStorageState<T>(key: string): StorageStateResult<T | undefined>;
export function useStorageState<T>(
  key: string,
  options: StorageStateOptions<T> & StorageStateCodec<T> & { defaultValue: T }
): StorageStateResult<T>;
export function useStorageState<T>(
  key: string,
  options: StorageStateOptions<T> & StorageStateCodec<T>
): StorageStateResult<T | undefined>;
export function useStorageState<T>(
  key: string,
  options: StorageStateOptions<T> & WithoutCodec & { defaultValue: T }
): StorageStateResult<T>;
export function useStorageState<T>(
  key: string,
  options: StorageStateOptions<T> & WithoutCodec
): StorageStateResult<T | undefined>;
export function useStorageState<T>(
  key: string,
  options: StorageStateOptions<T> & Partial<StorageStateCodec<T>> = {}
): StorageStateResult<T | undefined> {
  // Without `'use no memo'`, React Compiler throws when `panicThreshold` is not `'none'`
  // because `cache.current` is read from `getSnapshot`, which `useSyncExternalStore` calls
  // during render. Belongs on this implementation signature — the overload declarations
  // above have no body to carry a directive.
  'use no memo';

  const { storage = safeLocalStorage, defaultValue, serializer, deserializer } = options;
  // Both functions are picked by one condition so a value is never written in one format and read in another.
  const codec = serializer !== undefined && deserializer !== undefined ? { serializer, deserializer } : null;

  // `data` starts as `undefined`, which storage never returns, so the first snapshot always runs
  // the branch below and checks `defaultValue` on mount, even when storage already holds a value.
  const cache = useRef<{
    data: string | null | undefined;
    parsed: T | undefined;
  }>({
    data: undefined,
    parsed: defaultValue,
  });

  // Runs during render, so it reads this render's options instead of a ref that effects update later.
  const getSnapshot = () => {
    const data = storage.get(key);

    if (data !== cache.current.data) {
      const isMount = cache.current.data === undefined;
      const fallsBackToDefault = data == null;

      if (codec === null && defaultValue !== undefined && (isMount || fallsBackToDefault)) {
        assertJson(defaultValue, 'defaultValue');
      }

      try {
        cache.current.parsed = data != null ? deserialize(data) : defaultValue;
      } catch {
        cache.current.parsed = defaultValue;
      }
      cache.current.data = data;
    }

    return cache.current.parsed;
  };

  const storageState = useSyncExternalStore<T | undefined>(
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
    getSnapshot,
    () => defaultValue
  );

  // Insertion effects run before every layout and passive effect, so a child effect that calls
  // `setValue` in the commit that changed `key` or the serializer already sees this render's values.
  // `usePreservedCallback` syncs in a passive effect, which runs after the child's.
  const latest = useRef({ getSnapshot, writeValue });
  useInsertionEffect(function syncLatestRender() {
    latest.current = { getSnapshot, writeValue };
  });

  // Reads through `latest`, so `actions` stays stable even when the options are passed inline.
  const actions = useMemo<StorageStateActions<T | undefined>>(
    () => ({
      setValue: value => latest.current.writeValue(value),
      refresh: () => latest.current.writeValue(latest.current.getSnapshot()),
    }),
    []
  );

  return [storageState, actions] as const;

  function writeValue(value: SetStateAction<T | undefined>) {
    const nextValue = isUpdater(value) ? value(getSnapshot()) : value;

    if (nextValue == null) {
      storage.remove(key);
    } else {
      storage.set(key, serialize(nextValue));
    }
    emitListeners();
  }

  function serialize(value: T): string {
    if (codec !== null) {
      return codec.serializer(value);
    }
    assertJson(value, 'value');
    return JSON.stringify(value);
  }

  function deserialize(data: string): T {
    return codec !== null ? codec.deserializer(data) : JSON.parse(data);
  }
}
