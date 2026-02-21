import { act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

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
      act(() => {
        result.current[1]('new value');
      });
      expect(result.current[0]).toBe('new value');
    });

    it('should update value using function', async () => {
      const { result } = await renderHookSSR(() => useStorageState<number>('test-key', { defaultValue: 0, storage }));
      act(() => {
        result.current[1](prev => prev + 1);
      });
      expect(result.current[0]).toBe(1);
    });

    it('should sync between multiple hooks with same key', async () => {
      const { result: result1 } = await renderHookSSR(() => useStorageState<string>('test-key', { storage }));
      const { result: result2 } = await renderHookSSR(() => useStorageState<string>('test-key', { storage }));

      act(() => {
        result1.current[1]('updated value');
      });

      expect(result2.current[0]).toBe('updated value');
    });

    it('should refresh storage state', async () => {
      const { result } = await renderHookSSR(() => useStorageState('test-key', { storage }));

      storage.set('test-key', JSON.stringify({ hello: 'world' }));

      act(() => {
        result.current[2]();
      });

      expect(result.current[0]).toEqual({ hello: 'world' });
    });

    it('should work with custom serializer and deserializer', async () => {
      const serializer = (value: any) =>
        ['string', 'number', 'boolean'].includes(typeof value) ? value : JSON.stringify(value);
      const deserializer = (value: any) =>
        /^(\d+)|(true|false)|([^[].*)|([^{].*)$/.test(value) ? value : JSON.parse(value);

      const { result } = await renderHookSSR(() => useStorageState('test-key', { storage, serializer, deserializer }));

      act(() => {
        result.current[1]('hello');
      });

      expect(result.current[0]).toEqual('hello');
    });

    it('should throw error when value is not serializable', async () => {
      expect(
        async () => await renderHookSSR(() => useStorageState('test-key', { storage, defaultValue: () => 'world' }))
      ).rejects.toThrow('Received a non-serializable value');

      expect(
        async () =>
          await renderHookSSR(() => useStorageState('test-key', { storage, defaultValue: new (class Cls {})() }))
      ).rejects.toThrow('Received a non-serializable value');
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

      act(() => {
        result.current[1]('memo value');
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

      act(() => {
        result.current[1]('session value');
      });

      rerender();
      expect(result.current[0]).toBe('session value');
    });

    it('should not sync between different tabs', async () => {
      const { result } = await renderHookSSR(() =>
        useStorageState<string>('test-key', { storage: safeSessionStorage })
      );

      act(() => {
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

      act(() => {
        result.current[1]('local value');
      });

      rerender();
      expect(result.current[0]).toBe('local value');
    });

    it('should sync between different tabs', async () => {
      const { result } = await renderHookSSR(() => useStorageState<string>('test-key', { storage: safeLocalStorage }));

      act(() => {
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

    it('should return defaultValue when an error occured while parsing data', async () => {
      const { result } = await renderHookSSR(() =>
        useStorageState<string>('test-key', { storage: safeLocalStorage, defaultValue: 'default' })
      );

      act(() => {
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

      act(() => {
        result.current[1]('value');
      });

      expect(result.current[0]).toBe('value');

      act(() => {
        result.current[1](undefined);
      });

      expect(result.current[0]).toBeUndefined();
    });
  });
});
