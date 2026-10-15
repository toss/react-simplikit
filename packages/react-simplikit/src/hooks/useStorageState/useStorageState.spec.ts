import { act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, expectTypeOf, it } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import {
  generateSessionStorage,
  generateStorage,
  LocalStorage,
  MemoStorage,
  safeLocalStorage,
  safeSessionStorage,
  SessionStorage,
  Storage,
} from './storage.ts';
import { useStorageState } from './useStorageState.ts';

describe('Storage', () => {
  describe('MemoStorage', () => {
    let storage: MemoStorage;

    beforeEach(() => {
      storage = new MemoStorage();
    });

    it('should set and get value', async () => {
      storage.set('key', 'value');
      expect(storage.get('key')).toBe('value');
    });

    it('should return null for non-existent key', async () => {
      expect(storage.get('non-existent')).toBeNull();
    });

    it('should remove value', async () => {
      storage.set('key', 'value');
      storage.remove('key');
      expect(storage.get('key')).toBeNull();
    });

    it('should clear all values', async () => {
      storage.set('key1', 'value1');
      storage.set('key2', 'value2');
      storage.clear();
      expect(storage.get('key1')).toBeNull();
      expect(storage.get('key2')).toBeNull();
    });
  });

  describe('LocalStorage', () => {
    let storage: LocalStorage;

    beforeEach(() => {
      localStorage.clear();
      storage = new LocalStorage();
    });

    it('should check if localStorage is available', async () => {
      const originLocalStorage = window.localStorage;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete window.localStorage;

      const disabledLocalStorage = generateStorage();

      expect(disabledLocalStorage).toBeInstanceOf(MemoStorage);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.localStorage = originLocalStorage;
    });

    it('should set and get value', async () => {
      storage.set('key', 'value');
      expect(storage.get('key')).toBe('value');
    });

    it('should return null for non-existent key', async () => {
      expect(storage.get('non-existent')).toBeNull();
    });

    it('should remove value', async () => {
      storage.set('key', 'value');
      storage.remove('key');
      expect(storage.get('key')).toBeNull();
    });

    it('should clear all values', async () => {
      storage.set('key1', 'value1');
      storage.set('key2', 'value2');
      storage.clear();
      expect(storage.get('key1')).toBeNull();
      expect(storage.get('key2')).toBeNull();
    });
  });

  describe('SessionStorage', () => {
    let storage: SessionStorage;

    beforeEach(() => {
      sessionStorage.clear();
      storage = new SessionStorage();
    });

    it('should check if sessionStorage is available', async () => {
      const originSessionStorage = window.sessionStorage;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete window.sessionStorage;

      const disabledSessionStorage = generateSessionStorage();

      expect(disabledSessionStorage).toBeInstanceOf(MemoStorage);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.sessionStorage = originSessionStorage;
    });

    it('should set and get value', async () => {
      storage.set('key', 'value');
      expect(storage.get('key')).toBe('value');
    });

    it('should return null for non-existent key', async () => {
      expect(storage.get('non-existent')).toBeNull();
    });

    it('should remove value', async () => {
      storage.set('key', 'value');
      storage.remove('key');
      expect(storage.get('key')).toBeNull();
    });

    it('should clear all values', async () => {
      storage.set('key1', 'value1');
      storage.set('key2', 'value2');
      storage.clear();
      expect(storage.get('key1')).toBeNull();
      expect(storage.get('key2')).toBeNull();
    });
  });
});

describe('useStorageState', () => {
  // 공통 테스트 함수
  const runCommonTests = (storage: Storage) => {
    it('is safe on server side rendering', () => {
      const result = renderHookSSR.serverOnly(() => useStorageState('test-key', { defaultValue: 'default', storage }));

      const [value] = result.current;
      expect(value).toBe('default');
    });

    it('should initialize without default value', async () => {
      const { result } = await renderHookSSR(() => useStorageState('test-key', { storage }));
      expect(result.current[0]).toBeUndefined();
    });

    it('should initialize with default value', async () => {
      const defaultValue = 'default';
      const { result } = await renderHookSSR(() => useStorageState('test-key', { defaultValue, storage }));
      expect(result.current[0]).toBe(defaultValue);
    });

    it('should set and get value', async () => {
      const { result } = await renderHookSSR(() => useStorageState<string>('test-key', { storage }));
      await act(async () => {
        result.current[1].setValue('new value');
      });
      expect(result.current[0]).toBe('new value');
    });

    it('should update value using function', async () => {
      const { result } = await renderHookSSR(() => useStorageState<number>('test-key', { defaultValue: 0, storage }));
      await act(async () => {
        result.current[1].setValue(prev => prev + 1);
      });
      expect(result.current[0]).toBe(1);
    });

    it('should keep the actions object stable across renders', async () => {
      const { result } = await renderHookSSR(() => useStorageState<string>('test-key', { storage }));
      const [, actions] = result.current;
      await act(async () => {
        actions.setValue('new value');
      });
      expect(result.current[0]).toBe('new value');
      expect(result.current[1]).toBe(actions);
    });

    it('should sync between multiple hooks with same key', async () => {
      const { result: result1 } = await renderHookSSR(() => useStorageState<string>('test-key', { storage }));
      const { result: result2 } = await renderHookSSR(() => useStorageState<string>('test-key', { storage }));

      await act(async () => {
        result1.current[1].setValue('updated value');
      });

      expect(result2.current[0]).toBe('updated value');
    });

    it('should refresh storage state', async () => {
      const { result } = await renderHookSSR(() => useStorageState('test-key', { storage }));

      storage.set('test-key', JSON.stringify({ hello: 'world' }));

      await act(async () => {
        result.current[1].refresh();
      });

      expect(result.current[0]).toEqual({ hello: 'world' });
    });

    it('should work with custom serializer and deserializer', async () => {
      const serializer = (value: any) =>
        ['string', 'number', 'boolean'].includes(typeof value) ? value : JSON.stringify(value);
      const deserializer = (value: any) =>
        /^(\d+)|(true|false)|([^[].*)|([^{].*)$/.test(value) ? value : JSON.parse(value);

      const { result } = await renderHookSSR(() => useStorageState('test-key', { storage, serializer, deserializer }));

      await act(async () => {
        result.current[1].setValue('hello');
      });

      expect(result.current[0]).toEqual('hello');
    });

    it('should throw error when value is not serializable', async () => {
      await expect(
        async () => await renderHookSSR(() => useStorageState('test-key', { storage, defaultValue: () => 'world' }))
      ).rejects.toThrow('defaultValue is not JSON-serializable');

      await expect(
        async () =>
          await renderHookSSR(() => useStorageState('test-key', { storage, defaultValue: new (class Cls {})() }))
      ).rejects.toThrow('defaultValue is not JSON-serializable');
    });
  };

  describe('MemoStorage', () => {
    const storage: MemoStorage = new MemoStorage();

    afterEach(() => {
      storage.clear();
    });

    // 공통 테스트 실행
    runCommonTests(storage);

    it('should persist value after rerender', async () => {
      const { result, rerender } = await renderHookSSR(() => useStorageState<string>('test-key', { storage }));

      await act(async () => {
        result.current[1].setValue('memo value');
      });

      rerender();
      expect(result.current[0]).toBe('memo value');
    });
  });

  describe('SessionStorage', () => {
    beforeEach(() => {
      safeSessionStorage.clear();
    });

    // 공통 테스트 실행
    runCommonTests(safeSessionStorage);

    it('should persist value after rerender', async () => {
      const { result, rerender } = await renderHookSSR(() =>
        useStorageState<string>('test-key', { storage: safeSessionStorage })
      );

      await act(async () => {
        result.current[1].setValue('session value');
      });

      rerender();
      expect(result.current[0]).toBe('session value');
    });

    it('should not sync between different tabs', async () => {
      const { result } = await renderHookSSR(() =>
        useStorageState<string>('test-key', { storage: safeSessionStorage })
      );

      await act(async () => {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'test-key',
            newValue: JSON.stringify('value from other tab'),
          })
        );
      });

      expect(result.current[0]).toBeUndefined();
    });
  });

  describe('LocalStorage', () => {
    beforeEach(() => {
      safeLocalStorage.clear();
    });

    runCommonTests(safeLocalStorage);

    it('should persist value after rerender', async () => {
      const { result, rerender } = await renderHookSSR(() =>
        useStorageState<string>('test-key', { storage: safeLocalStorage })
      );

      await act(async () => {
        result.current[1].setValue('local value');
      });

      rerender();
      expect(result.current[0]).toBe('local value');
    });

    it('should sync between different tabs', async () => {
      const { result } = await renderHookSSR(() => useStorageState<string>('test-key', { storage: safeLocalStorage }));

      await act(async () => {
        localStorage.setItem('test-key', JSON.stringify('value from other tab'));
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'test-key',
            newValue: JSON.stringify('value from other tab'),
          })
        );
      });

      expect(result.current[0]).toBe('value from other tab');
    });

    it.each(['default', undefined])('should reset to %s when another tab clears localStorage', async defaultValue => {
      localStorage.setItem('test-key', JSON.stringify('stored value'));
      const { result } = await renderHookSSR(() =>
        useStorageState<string>('test-key', { storage: safeLocalStorage, defaultValue })
      );
      expect(result.current[0]).toBe('stored value');

      await act(async () => {
        localStorage.clear();
        window.dispatchEvent(new StorageEvent('storage', { key: null, storageArea: localStorage }));
      });

      expect(result.current[0]).toBe(defaultValue);
    });

    it('should preserve localStorage state when sessionStorage is cleared', async () => {
      localStorage.setItem('test-key', JSON.stringify('stored value'));
      sessionStorage.setItem('test-key', JSON.stringify('session value'));
      const { result } = await renderHookSSR(() => useStorageState<string>('test-key', { storage: safeLocalStorage }));

      await act(async () => {
        sessionStorage.clear();
        window.dispatchEvent(new StorageEvent('storage', { key: null, storageArea: sessionStorage }));
      });

      expect(result.current[0]).toBe('stored value');
    });

    it('should reset to defaultValue when another tab removes the observed key', async () => {
      localStorage.setItem('test-key', JSON.stringify('stored value'));
      const { result } = await renderHookSSR(() =>
        useStorageState<string>('test-key', { storage: safeLocalStorage, defaultValue: 'default' })
      );

      await act(async () => {
        localStorage.removeItem('test-key');
        window.dispatchEvent(new StorageEvent('storage', { key: 'test-key', storageArea: localStorage }));
      });

      expect(result.current[0]).toBe('default');
    });

    it('should preserve the observed value when another tab removes an unrelated key', async () => {
      localStorage.setItem('test-key', JSON.stringify('stored value'));
      localStorage.setItem('other-key', JSON.stringify('other value'));
      const { result } = await renderHookSSR(() => useStorageState<string>('test-key', { storage: safeLocalStorage }));

      await act(async () => {
        localStorage.removeItem('other-key');
        window.dispatchEvent(new StorageEvent('storage', { key: 'other-key', storageArea: localStorage }));
      });

      expect(result.current[0]).toBe('stored value');
    });

    it('should return defaultValue when an error occurred while parsing data', async () => {
      const { result } = await renderHookSSR(() =>
        useStorageState<string>('test-key', { storage: safeLocalStorage, defaultValue: 'default' })
      );

      await act(async () => {
        localStorage.setItem('test-key', '{ "test": "hi" ');
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'test-key',
            newValue: '{ "test": "hi" ',
          })
        );
      });

      expect(result.current[0]).toBe('default');
    });

    it('should remove value when set value to undefined', async () => {
      const { result } = await renderHookSSR(() => useStorageState<string>('test-key', { storage: safeLocalStorage }));

      await act(async () => {
        result.current[1].setValue('value');
      });

      expect(result.current[0]).toBe('value');

      await act(async () => {
        result.current[1].setValue(undefined);
      });

      expect(result.current[0]).toBeUndefined();
    });
  });

  describe('when the value is stored as JSON', () => {
    const storage = new MemoStorage();

    afterEach(() => {
      storage.clear();
    });

    it('should throw with the path when a nested Date is set', async () => {
      const { result } = await renderHookSSR(() =>
        useStorageState<{ list: Array<{ at: Date | string }> }>('test-key', {
          storage,
          defaultValue: { list: [{ at: 'now' }] },
        })
      );

      expect(() => act(() => result.current[1].setValue({ list: [{ at: 'now' }, { at: new Date() }] }))).toThrow(
        'value.list[1].at is not JSON-serializable'
      );
      expect(storage.get('test-key')).toBeNull();
    });

    it('should throw when a nested function is set through an updater', async () => {
      const { result } = await renderHookSSR(() =>
        useStorageState<Record<string, unknown>>('test-key', { storage, defaultValue: {} })
      );

      expect(() => act(() => result.current[1].setValue(prev => ({ ...prev, onClick: () => {} })))).toThrow(
        'value.onClick is not JSON-serializable'
      );
    });

    it('should throw for NaN and for undefined inside an array', async () => {
      const { result } = await renderHookSSR(() => useStorageState<unknown>('test-key', { storage }));

      expect(() => act(() => result.current[1].setValue({ ratio: NaN }))).toThrow(
        'value.ratio is not JSON-serializable'
      );
      expect(() => act(() => result.current[1].setValue([1, undefined]))).toThrow('value[1] is not JSON-serializable');
    });

    it('should drop an undefined property like JSON.stringify does', async () => {
      const { result } = await renderHookSSR(() =>
        useStorageState<{ nickname: string | undefined; age: number }>('test-key', {
          storage,
          defaultValue: { nickname: undefined, age: 1 },
        })
      );

      await act(async () => {
        result.current[1].setValue({ nickname: undefined, age: 2 });
      });

      expect(storage.get('test-key')).toBe('{"age":2}');
    });

    it('should check defaultValue on mount even when storage already holds a value', async () => {
      storage.set('test-key', JSON.stringify({ at: '2026-01-01' }));

      await expect(
        async () =>
          await renderHookSSR(() => useStorageState('test-key', { storage, defaultValue: { at: new Date(0) } }))
      ).rejects.toThrow('defaultValue.at is not JSON-serializable');
    });
  });

  describe('when serializer and deserializer are passed', () => {
    const storage = new MemoStorage();

    afterEach(() => {
      storage.clear();
    });

    it('should store a Date default and updates without the JSON check', async () => {
      const { result } = await renderHookSSR(() =>
        useStorageState('test-key', {
          storage,
          defaultValue: new Date(0),
          serializer: date => date.toISOString(),
          deserializer: text => new Date(text),
        })
      );

      expect(result.current[0]).toEqual(new Date(0));

      await act(async () => {
        result.current[1].setValue(new Date(1000));
      });

      expect(storage.get('test-key')).toBe('1970-01-01T00:00:01.000Z');
      expect(result.current[0]).toEqual(new Date(1000));
    });

    it('should ignore a deserializer passed without a serializer', async () => {
      storage.set('test-key', JSON.stringify('stored'));
      const options = { storage, deserializer: () => 'custom' };

      // @ts-expect-error A lone deserializer would read a format the value was never written in.
      const { result } = await renderHookSSR(() => useStorageState('test-key', options));

      expect(result.current[0]).toBe('stored');
    });
  });

  describe('types', () => {
    type User = { name: string };
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- users declare stored shapes as interfaces too, and an interface has no implicit index signature
    interface Settings {
      theme: string;
    }

    it('should infer the state type from defaultValue and the generic', () => {
      function useTypeCheck() {
        const [count, { setValue: setCount }] = useStorageState('count', { defaultValue: 0 });
        expectTypeOf(count).toEqualTypeOf<number>();
        setCount(count + 1);
        setCount(prev => prev + 1);

        const [theme] = useStorageState('theme', { defaultValue: 'light' });
        expectTypeOf(theme).toEqualTypeOf<string>();

        const [mode, { setValue: setMode }] = useStorageState<'light' | 'dark'>('mode', { defaultValue: 'light' });
        expectTypeOf(mode).toEqualTypeOf<'light' | 'dark'>();
        // @ts-expect-error 'blue' is not one of the declared modes.
        setMode('blue');

        const [token] = useStorageState<string>('token');
        expectTypeOf(token).toEqualTypeOf<string | undefined>();
      }

      expectTypeOf(useTypeCheck).toBeFunction();
    });

    it('should keep null, interfaces and records in the state type', () => {
      function useTypeCheck() {
        const [user] = useStorageState<User | null>('user', { defaultValue: null });
        expectTypeOf(user).toEqualTypeOf<User | null>();

        const [settings] = useStorageState<Settings>('settings', { defaultValue: { theme: 'light' } });
        expectTypeOf(settings).toEqualTypeOf<Settings>();

        const [record] = useStorageState<Record<string, unknown>>('record', { defaultValue: { a: 1 } });
        expectTypeOf(record).toEqualTypeOf<Record<string, unknown>>();
      }

      expectTypeOf(useTypeCheck).toBeFunction();
    });

    it('should type serializer and deserializer from defaultValue', () => {
      function useTypeCheck() {
        const [date] = useStorageState('date', {
          defaultValue: new Date(0),
          serializer: value => value.toISOString(),
          deserializer: text => new Date(text),
        });
        expectTypeOf(date).toEqualTypeOf<Date>();

        const [maybeDate] = useStorageState<Date>('maybe-date', {
          serializer: value => value.toISOString(),
          deserializer: text => new Date(text),
        });
        expectTypeOf(maybeDate).toEqualTypeOf<Date | undefined>();

        // @ts-expect-error A serializer needs a matching deserializer.
        useStorageState('half', { defaultValue: 0, serializer: value => String(value) });
      }

      expectTypeOf(useTypeCheck).toBeFunction();
    });

    it('should accept a generic value from a wrapping hook', () => {
      function useWrapped<T>(key: string, defaultValue: T) {
        const [value, { setValue }] = useStorageState(key, { defaultValue });
        setValue(value);
        return value;
      }

      expectTypeOf(useWrapped<number>).returns.toEqualTypeOf<number>();
    });
  });
});
