import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useBooleanState } from './useBooleanState.ts';

describe('useBooleanState', () => {
  it('is safe on server side rendering', async () => {
    const result = renderHookSSR.serverOnly(() => useBooleanState(true));

    const [bool] = result.current;

    expect(bool).toBe(true);
  });

  it('should initialize with the default value', async () => {
    const { result } = await renderHookSSR(() => useBooleanState(false));
    const [bool] = result.current;

    expect(bool).toBe(false);
  });

  it('should set value to true when setTrue is called', async () => {
    const { result } = await renderHookSSR(() => useBooleanState(false));
    const [, setTrue] = result.current;

    await act(async () => {
      setTrue();
    });

    const [bool] = result.current;
    expect(bool).toBe(true);
  });

  it('should set value to false when setFalse is called', async () => {
    const { result } = await renderHookSSR(() => useBooleanState(true));
    const [, , setFalse] = result.current;

    await act(async () => {
      setFalse();
    });

    const [bool] = result.current;
    expect(bool).toBe(false);
  });

  it('should toggle value when toggle is called', async () => {
    const { result } = await renderHookSSR(() => useBooleanState(false));
    const [, , , toggle] = result.current;

    await act(async () => {
      toggle();
    });

    let [bool] = result.current;
    expect(bool).toBe(true);

    await act(async () => {
      toggle();
    });

    [bool] = result.current;
    expect(bool).toBe(false);
  });

  it('should work with default value set to true', async () => {
    const { result } = await renderHookSSR(() => useBooleanState(true));
    const [bool] = result.current;

    expect(bool).toBe(true);
  });
});
