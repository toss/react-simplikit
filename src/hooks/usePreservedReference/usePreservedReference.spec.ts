/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { usePreservedReference } from './usePreservedReference.ts';

describe('usePreservedReference', () => {
  it('is safe on server side rendering', () => {
    const result = renderHookSSR.serverOnly(() => usePreservedReference(10));

    expect(result.current).toBe(10);
  });

  it('initializes and updates with primitive values', async () => {
    const initialValue = 10;
    const { result, rerender } = await renderHookSSR(({ value }) => usePreservedReference(value), {
      initialProps: {
        value: initialValue,
      },
    });

    expect(result.current).toEqual(initialValue);

    const newValue = 20;
    rerender({ value: newValue });

    expect(result.current).toEqual(newValue);
  });

  it('initializes and updates with objects', async () => {
    const initialValue = { key: 'value' };
    const { result, rerender } = await renderHookSSR(({ value }) => usePreservedReference(value), {
      initialProps: {
        value: initialValue,
      },
    });
    expect(result.current).toEqual(initialValue);

    const newValue = { key: 'new value' };
    rerender({ value: newValue });

    expect(result.current).toEqual(newValue);
  });

  it('initializes with objects and updates function arguments', async () => {
    const initialFunction = () => console.log('hello');
    const initialValue = { key: 'value', action: initialFunction };
    const initialProps: {
      value: any;
      areValuesEqual?: (a: any, b: any) => boolean;
    } = { value: initialValue, areValuesEqual: areDeeplyEqual };

    const { result, rerender } = await renderHookSSR(
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

  it('does not update when deep equal objects are passed', async () => {
    const initialValue = { key: 'value' };
    const { result, rerender } = await renderHookSSR(({ value }) => usePreservedReference(value), {
      initialProps: {
        value: initialValue,
      },
    });

    const newValue = { key: 'value' };
    rerender({ value: newValue });

    expect(result.current).toEqual(initialValue);
    expect(result.current).not.toBe(newValue);
  });

  it('updates when non-deep equal objects are passed', async () => {
    const initialValue = { key: 'value' };
    const { result, rerender } = await renderHookSSR(({ value }) => usePreservedReference(value), {
      initialProps: {
        value: initialValue,
      },
    });

    const newValue = { key: 'new value' };
    rerender({ value: newValue });

    expect(result.current).toEqual(newValue);
    expect(result.current).not.toEqual(initialValue);
  });

  it('updates when object properties are added', async () => {
    const initialValue = { key: 'value' };
    const { result, rerender } = await renderHookSSR(({ value }) => usePreservedReference(value), {
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
