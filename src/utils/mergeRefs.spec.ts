import { useCallback, useRef } from 'react';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { mergeRefs } from './mergeRefs.ts';

describe('mergeRefs', () => {
  it('should properly assign value to object ref', () => {
    const ref = { current: null };
    const mergedRef = mergeRefs<string | null>(ref);
    const value = 'test-value';

    act(() => {
      mergedRef(value);
    });

    expect(ref.current).toBe(value);
  });

  it('should properly call function ref', () => {
    let refValue: string | null = null;
    const callbackRef = (value: string | null) => {
      refValue = value;
    };
    const mergedRef = mergeRefs<string>(callbackRef);
    const value = 'test-value';

    act(() => {
      mergedRef(value);
    });

    expect(refValue).toBe(value);
  });

  it('should merge multiple refs', () => {
    const ref1 = { current: null };
    const ref2 = { current: null };
    let ref3Value: string | null = null;
    const ref3 = (value: string | null) => {
      ref3Value = value;
    };

    const mergedRef = mergeRefs<string | null>(ref1, ref2, ref3);
    const value = 'test-value';

    act(() => {
      mergedRef(value);
    });

    expect(ref1.current).toBe(value);
    expect(ref2.current).toBe(value);
    expect(ref3Value).toBe(value);
  });

  it('should work with actual React hooks', () => {
    let ref3Value: string | null = null;
    const { result } = renderHook(() => {
      const ref1 = useRef<string | null>(null);
      const ref2 = useCallback((node: string | null) => {
        ref3Value = node;
      }, []);

      return { ref1, ref2, mergedRef: mergeRefs<string | null>(ref1, ref2) };
    });

    const value = 'test-value';

    act(() => {
      result.current.mergedRef(value);
    });

    expect(result.current.ref1.current).toBe(value);
    expect(ref3Value).toBe(value);
  });
});
