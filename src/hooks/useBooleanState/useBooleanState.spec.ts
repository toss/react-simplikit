import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useBooleanState } from './useBooleanState.ts';

describe('useBooleanState', () => {
  it('should initialize with the default value', () => {
    const { result } = renderHook(() => useBooleanState(false));
    const [bool] = result.current;

    expect(bool).toBe(false);
  });

  it('should set value to true when setTrue is called', () => {
    const { result } = renderHook(() => useBooleanState(false));
    const [, setTrue] = result.current;

    act(() => {
      setTrue();
    });

    const [bool] = result.current;
    expect(bool).toBe(true);
  });

  it('should set value to false when setFalse is called', () => {
    const { result } = renderHook(() => useBooleanState(true));
    const [, , setFalse] = result.current;

    act(() => {
      setFalse();
    });

    const [bool] = result.current;
    expect(bool).toBe(false);
  });

  it('should toggle value when toggle is called', () => {
    const { result } = renderHook(() => useBooleanState(false));
    const [, , , toggle] = result.current;

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

  it('should work with default value set to true', () => {
    const { result } = renderHook(() => useBooleanState(true));
    const [bool] = result.current;

    expect(bool).toBe(true);
  });
});
