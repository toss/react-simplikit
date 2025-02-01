import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

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

    it('should set and get value', () => {
      storage.set('key', 'value');
      expect(storage.get('key')).toBe('value');
    });

    it('should return null for non-existent key', () => {
      expect(storage.get('non-existent')).toBeNull();
    });

    it('should remove value', () => {
      storage.set('key', 'value');
      storage.remove('key');
      expect(storage.get('key')).toBeNull();
    });

    it('should clear all values', () => {
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

    it('should check if localStorage is available', () => {
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

    it('should set and get value', () => {
      storage.set('key', 'value');
      expect(storage.get('key')).toBe('value');
    });

    it('should return null for non-existent key', () => {
      expect(storage.get('non-existent')).toBeNull();
    });

    it('should remove value', () => {
      storage.set('key', 'value');
      storage.remove('key');
      expect(storage.get('key')).toBeNull();
    });

    it('should clear all values', () => {
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

    it('should check if sessionStorage is available', () => {
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

    it('should set and get value', () => {
      storage.set('key', 'value');
      expect(storage.get('key')).toBe('value');
    });

    it('should return null for non-existent key', () => {
      expect(storage.get('non-existent')).toBeNull();
    });

    it('should remove value', () => {
      storage.set('key', 'value');
      storage.remove('key');
      expect(storage.get('key')).toBeNull();
    });

    it('should clear all values', () => {
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
    it('should initialize without default value', () => {
      const { result } = renderHook(() => useStorageState('test-key', { storage }));
      expect(result.current[0]).toBeUndefined();
    });

    it('should initialize with default value', () => {
      const defaultValue = 'default';
      const { result } = renderHook(() => useStorageState('test-key', { defaultValue, storage }));
      expect(result.current[0]).toBe(defaultValue);
    });

    it('should set and get value', () => {
      const { result } = renderHook(() => useStorageState<string>('test-key', { storage }));
      act(() => {
        result.current[1]('new value');
      });
      expect(result.current[0]).toBe('new value');
    });

    it('should update value using function', () => {
      const { result } = renderHook(() => useStorageState<number>('test-key', { defaultValue: 0, storage }));
      act(() => {
        result.current[1](prev => prev + 1);
      });
      expect(result.current[0]).toBe(1);
    });

    it('should sync between multiple hooks with same key', () => {
      const { result: result1 } = renderHook(() => useStorageState<string>('test-key', { storage }));
      const { result: result2 } = renderHook(() => useStorageState<string>('test-key', { storage }));

      act(() => {
        result1.current[1]('updated value');
      });

      expect(result2.current[0]).toBe('updated value');
    });
  };

  describe('MemoStorage', () => {
    const storage: MemoStorage = new MemoStorage();

    afterEach(() => {
      storage.clear();
    });

    // 공통 테스트 실행
    runCommonTests(storage);

    it('should persist value after rerender', () => {
      const { result, rerender } = renderHook(() => useStorageState<string>('test-key', { storage }));

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

    it('should persist value after rerender', () => {
      const { result, rerender } = renderHook(() =>
        useStorageState<string>('test-key', { storage: safeSessionStorage })
      );

      act(() => {
        result.current[1]('session value');
      });

      rerender();
      expect(result.current[0]).toBe('session value');
    });

    it('should not sync between different tabs', () => {
      const { result } = renderHook(() => useStorageState<string>('test-key', { storage: safeSessionStorage }));

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

    it('should persist value after rerender', () => {
      const { result, rerender } = renderHook(() => useStorageState<string>('test-key', { storage: safeLocalStorage }));

      act(() => {
        result.current[1]('local value');
      });

      rerender();
      expect(result.current[0]).toBe('local value');
    });

    it('should sync between different tabs', () => {
      const { result } = renderHook(() => useStorageState<string>('test-key', { storage: safeLocalStorage }));

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

    it('should return defaultValue when an error occured while parsing data', () => {
      const { result } = renderHook(() =>
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

    it('should remove value when set value to undefined', () => {
      const { result } = renderHook(() => useStorageState<string>('test-key', { storage: safeLocalStorage }));

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
