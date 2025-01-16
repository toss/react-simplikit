import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { MemoStorage, safeLocalStorage, safeSessionStorage, Storage } from './storage.ts';
import { useStorageState } from './useStorageState.ts';

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
  });
});
