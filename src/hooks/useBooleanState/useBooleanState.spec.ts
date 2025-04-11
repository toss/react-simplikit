import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useBooleanState } from './useBooleanState.ts';

describe('useBooleanState', () => {
  it('should initialize default value even if in server', async () => {
    const server = renderHookSSR.serverOnly(() => useBooleanState(true));

    server(result => {
      const [bool] = result.current ?? [];

      expect(result.error).toBeUndefined();
      expect(bool).toBe(true);
    });
  });

  it('should initialize with the default value', async () => {
    const { result } = await renderHookSSR(() => useBooleanState(false));
    const [bool] = result.current;

    expect(bool).toBe(false);
  });

  it('should set value to true when setTrue is called', async () => {
    const { result } = await renderHookSSR(() => useBooleanState(false));
    const [, setTrue] = result.current;

    act(() => {
      setTrue();
    });

    const [bool] = result.current;
    expect(bool).toBe(true);
  });

  it('should set value to false when setFalse is called', async () => {
    const { result } = await renderHookSSR(() => useBooleanState(true));
    const [, , setFalse] = result.current;

    act(() => {
      setFalse();
    });

    const [bool] = result.current;
    expect(bool).toBe(false);
  });

  it('should toggle value when toggle is called', async () => {
    const { result } = await renderHookSSR(() => useBooleanState(false));
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

  it('should work with default value set to true', async () => {
    const { result } = await renderHookSSR(() => useBooleanState(true));
    const [bool] = result.current;

    expect(bool).toBe(true);
  });
});
