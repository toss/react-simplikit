import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useToggle } from './useToggle.ts';

describe('useToggle', () => {
  it('is safe on server side rendering', () => {
    const result = renderHookSSR.serverOnly(() => useToggle(false));

    const [bool] = result.current;
    expect(bool).toBe(false);
  });

  it('should initialize with the default value false', async () => {
    const { result } = await renderHookSSR(() => useToggle(false));
    const [bool] = result.current;

    expect(bool).toBe(false);
  });

  it('should initialize with the default value true', async () => {
    const { result } = await renderHookSSR(() => useToggle(true));
    const [bool] = result.current;

    expect(bool).toBe(true);
  });

  it('should toggle value when toggle is called', async () => {
    const { result } = await renderHookSSR(() => useToggle(false));
    const [, toggle] = result.current;

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
});
