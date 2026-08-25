import { useCallback, useRef } from 'react';
import { act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { mergeRefs } from './mergeRefs.ts';

describe('mergeRefs', () => {
  it('should properly assign value to object ref', async () => {
    const ref = { current: null };
    const mergedRef = mergeRefs<string | null>(ref);
    const value = 'test-value';

    await act(async () => {
      mergedRef(value);
    });

    expect(ref.current).toBe(value);
  });

  it('should properly call function ref', async () => {
    let refValue: string | null = null;
    const callbackRef = (value: string | null) => {
      refValue = value;
    };
    const mergedRef = mergeRefs<string>(callbackRef);
    const value = 'test-value';

    await act(async () => {
      mergedRef(value);
    });

    expect(refValue).toBe(value);
  });

  it('should merge multiple refs', async () => {
    const ref1 = { current: null };
    const ref2 = { current: null };
    const ref3 = null;
    let ref4Value: string | null = null;
    const ref4 = (value: string | null) => {
      ref4Value = value;
    };

    const mergedRef = mergeRefs<string | null>(ref1, ref2, ref3, ref4);
    const value = 'test-value';

    await act(async () => {
      mergedRef(value);
    });

    expect(ref1.current).toBe(value);
    expect(ref2.current).toBe(value);
    expect(ref4Value).toBe(value);
  });

  it('should work with actual React hooks', async () => {
    let ref3Value: string | null = null;
    const { result } = await renderHookSSR(() => {
      const ref1 = useRef<string | null>(null);
      const ref2 = useCallback((node: string | null) => {
        ref3Value = node;
      }, []);

      return { ref1, ref2, mergedRef: mergeRefs<string | null>(ref1, ref2) };
    });

    const value = 'test-value';

    await act(async () => {
      result.current.mergedRef(value);
    });

    expect(result.current.ref1.current).toBe(value);
    expect(ref3Value).toBe(value);
  });

  it('should call cleanup functions returned by callback refs', () => {
    const cleanupCalls: string[] = [];

    const callbackRef1 = vi.fn(() => {
      return () => {
        cleanupCalls.push('cleanup1');
      };
    });

    const callbackRef2 = vi.fn(() => {
      return () => {
        cleanupCalls.push('cleanup2');
      };
    });

    const mergedRef = mergeRefs<string | null>(callbackRef1, callbackRef2);
    const value = 'test-value';

    act(() => {
      mergedRef(value);
    });

    const cleanupFn = mergedRef(null);
    if (cleanupFn) {
      cleanupFn();
    }

    expect(cleanupCalls).toEqual(['cleanup1', 'cleanup2']);
    expect(callbackRef1).toHaveBeenCalledWith(value);
    expect(callbackRef2).toHaveBeenCalledWith(value);
  });

  it('verifies that object refs initialize correctly without cleanup functions', () => {
    const refObj = { current: 'initial' };
    const mergedRef = mergeRefs(refObj);

    act(() => {
      mergedRef('new-value');
    });
    expect(refObj.current).toBe('new-value');

    const cleanupFn = mergedRef(null);
    expect(cleanupFn).toBeInstanceOf(Function);

    if (cleanupFn) {
      cleanupFn();
    }
    expect(refObj.current).toBeNull();
  });
});
