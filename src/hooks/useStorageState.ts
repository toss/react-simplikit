import { SetStateAction, useCallback, useSyncExternalStore } from 'react';

import { MemoStorage, Storage } from '../_internal/storage.ts';

type ToPrimitive<T> = T extends string ? string : T extends number ? number : T extends boolean ? boolean : never;
type ToObject<T> = T extends unknown[] | Record<string, unknown> ? T : never;

export type Serializable<T> = T extends string | number | boolean ? ToPrimitive<T> : ToObject<T>;

interface StorageStateOptions<T> {
  storage?: Storage;
  defaultValue?: Serializable<T>;
}

interface StorageStateOptionsWithDefaultValue<T> extends StorageStateOptions<T> {
  defaultValue: Serializable<T>;
}

const listeners = new Set<() => void>();

const emitListeners = () => {
  listeners.forEach(listener => listener());
};

/**
 * a hook that works like useState but stores the state value in the storage and retains the value.
 * @param key key for storage
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
  { storage = new MemoStorage(), defaultValue }: StorageStateOptions<T> = {}
): readonly [Serializable<T> | undefined, (value: SetStateAction<Serializable<T> | undefined>) => void] {
  const getValue = useCallback(<T>() => {
    const data = storage.get(key);

    if (data == null) {
      return defaultValue;
    }

    try {
      const result = JSON.parse(data);

      if (result == null) {
        return defaultValue;
      }

      return result as T;
    } catch {
      return defaultValue;
    }
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
    () => getValue()
  );

  const setStorageState = useCallback(
    (value: SetStateAction<Serializable<T> | undefined>) => {
      const nextValue = typeof value === 'function' ? value(getValue()) : value;

      if (nextValue == null) {
        storage.remove(key);
      } else {
        storage.set(key, JSON.stringify(nextValue));
      }
      emitListeners();
    },
    [getValue, key, storage]
  );

  return [storageState, setStorageState] as const;
}
