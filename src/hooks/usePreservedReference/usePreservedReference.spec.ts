/* eslint-disable @typescript-eslint/no-explicit-any */
import { renderHook } from '@testing-library/react';

import { usePreservedReference } from './usePreservedReference.ts';

describe('usePreservedReference', () => {
  it('initializes and updates with primitive values', () => {
    const initialValue = 10;
    const { result, rerender } = renderHook(({ value }) => usePreservedReference(value), {
      initialProps: {
        value: initialValue,
      },
    });

    expect(result.current).toEqual(initialValue);

    const newValue = 20;
    rerender({ value: newValue });

    expect(result.current).toEqual(newValue);
  });

  it('initializes and updates with objects', () => {
    const initialValue = { key: 'value' };
    const { result, rerender } = renderHook(({ value }) => usePreservedReference(value), {
      initialProps: {
        value: initialValue,
      },
    });
    expect(result.current).toEqual(initialValue);

    const newValue = { key: 'new value' };
    rerender({ value: newValue });

    expect(result.current).toEqual(newValue);
  });

  it('initializes with objects and updates function arguments', () => {
    const initialFunction = () => console.log('hello');
    const initialValue = { key: 'value', action: initialFunction };
    const initialProps: {
      value: any;
      areValuesEqual?: (a: any, b: any) => boolean;
    } = { value: initialValue, areValuesEqual: areDeeplyEqual };

    const { result, rerender } = renderHook(
      ({ value, areValuesEqual }) => usePreservedReference(value, areValuesEqual),
      {
        initialProps,
      }
    );

    const newFunction = () => console.log('hello world');
    const newValue = { key: 'value', action: newFunction };

    rerender({ value: newValue });
    expect(result.current.action).toBe(initialFunction);

    /**
     * The default behavior of areValuesEqual provided by usePreservedReference
     * is to compare using JSON.stringify, which cannot detect changes in functions.
     * Therefore, a separate comparator that can compare functions should be provided.
     */
    rerender({ value: newValue, areValuesEqual: areDeeplyEqual });
    expect(result.current.action).not.toBe(initialFunction);
    expect(result.current.action).toBe(newFunction);
  });

  it('does not update when deep equal objects are passed', () => {
    const initialValue = { key: 'value' };
    const { result, rerender } = renderHook(({ value }) => usePreservedReference(value), {
      initialProps: {
        value: initialValue,
      },
    });

    const newValue = { key: 'value' };
    rerender({ value: newValue });

    expect(result.current).toEqual(initialValue);
    expect(result.current).not.toBe(newValue);
  });

  it('updates when non-deep equal objects are passed', () => {
    const initialValue = { key: 'value' };
    const { result, rerender } = renderHook(({ value }) => usePreservedReference(value), {
      initialProps: {
        value: initialValue,
      },
    });

    const newValue = { key: 'new value' };
    rerender({ value: newValue });

    expect(result.current).toEqual(newValue);
    expect(result.current).not.toEqual(initialValue);
  });

  it('updates when object properties are added', () => {
    const initialValue = { key: 'value' };
    const { result, rerender } = renderHook(({ value }) => usePreservedReference(value), {
      initialProps: {
        value: initialValue,
      },
    });

    const newValue = { key: 'value', newKey: 'new value' };
    rerender({ value: newValue });

    expect(result.current).toEqual(newValue);
    expect(result.current).toHaveProperty('newKey', 'new value');
  });
});

function areDeeplyEqual<T>(a: T, b: T): boolean {
  if (a === b) {
    return true;
  }

  if (typeof a !== typeof b) {
    return false;
  }

  if (typeof a === 'function' && typeof b === 'function') {
    return a.toString() === b.toString();
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) {
    return a === b;
  }

  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) {
    return false;
  }

  const keysA = Object.keys(a as any);
  const keysB = Object.keys(b as any);

  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every(key => areDeeplyEqual((a as any)[key], (b as any)[key]));
}
