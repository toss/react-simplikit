import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { usePreservedReference } from './usePreservedReference.ts';

describe('usePreservedReference', () => {
  it('should return the same reference for deeply equal values', () => {
    const areValuesEqual = vi.fn((a, b) => JSON.stringify(a) === JSON.stringify(b));

    const { result, rerender } = renderHook(({ value }) => usePreservedReference(value, areValuesEqual), {
      initialProps: { value: { key: 'value' } },
    });

    const initialRef = result.current;

    // Rerender with a deeply equal value
    rerender({ value: { key: 'value' } });

    // Assert the reference remains the same
    expect(result.current).toBe(initialRef);
    expect(areValuesEqual).toHaveBeenCalledWith(initialRef, { key: 'value' });
  });

  it('should return a new reference for deeply unequal values', () => {
    const areValuesEqual = vi.fn((a, b) => JSON.stringify(a) === JSON.stringify(b));

    const { result, rerender } = renderHook(({ value }) => usePreservedReference(value, areValuesEqual), {
      initialProps: { value: { key: 'value1' } },
    });

    const initialRef = result.current;

    // Rerender with a different value
    rerender({ value: { key: 'value2' } });

    // Assert the reference changes
    expect(result.current).not.toBe(initialRef);
    expect(areValuesEqual).toHaveBeenCalledWith(initialRef, { key: 'value2' });
  });

  it('should handle custom comparator functions', () => {
    const customComparator = vi.fn((a, b) => a.id === b.id);

    const { result, rerender } = renderHook(({ value }) => usePreservedReference(value, customComparator), {
      initialProps: { value: { id: 1, name: 'Alice' } },
    });

    const initialRef = result.current;

    // Rerender with a value that has the same id
    rerender({ value: { id: 1, name: 'Bob' } });

    // Assert the reference remains the same
    expect(result.current).toBe(initialRef);
    expect(customComparator).toHaveBeenCalledWith(initialRef, { id: 1, name: 'Bob' });

    // Rerender with a value that has a different id
    rerender({ value: { id: 2, name: 'Charlie' } });

    // Assert the reference changes
    expect(result.current).not.toBe(initialRef);
    expect(customComparator).toHaveBeenCalledWith(initialRef, { id: 2, name: 'Charlie' });
  });
});
