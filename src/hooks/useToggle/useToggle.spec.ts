import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useToggle } from './useToggle.ts';

describe('useToggle', () => {
  it('should initialize with the default value false', () => {
    const { result } = renderHook(() => useToggle(false));
    const [bool] = result.current;

    expect(bool).toBe(false);
  });

  it('should initialize with the default value true', () => {
    const { result } = renderHook(() => useToggle(true));
    const [bool] = result.current;

    expect(bool).toBe(true);
  });

  it('should toggle value when toggle is called', () => {
    const { result } = renderHook(() => useToggle(false));
    const [, toggle] = result.current;

    act(() => {
      toggle();
    });

    let [bool] = result.current;
    expect(bool).toBe(true);

    act(() => {
      toggle();
    });

    [bool] = result.current;
    expect(bool).toBe(false);
  });
});
