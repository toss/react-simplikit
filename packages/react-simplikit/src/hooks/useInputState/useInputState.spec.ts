import { createElement } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useInputState } from './useInputState.ts';

function createTestInput(...params: Parameters<typeof useInputState>) {
  return function Input() {
    const [value, onChange] = useInputState(...params);

    return createElement('input', {
      type: 'text',
      value,
      onChange,
    });
  };
}

function createTestTextarea(...params: Parameters<typeof useInputState>) {
  return function Textarea() {
    const [value, onChange] = useInputState(...params);

    return createElement('textarea', {
      value,
      onChange,
    });
  };
}

describe('useInputState', () => {
  it('should return empty string for initial value when no argument is provided', async () => {
    const { result } = await renderHookSSR(() => useInputState());
    const [value] = result.current;

    expect(value).toBe('');
  });

  it('should return the provided value until input changes', async () => {
    const { result: result1 } = await renderHookSSR(() => useInputState('some-value'));
    expect(result1.current[0]).toBe('some-value');

    const { result: result2 } = await renderHookSSR(() => useInputState('other-value'));
    expect(result2.current[0]).toBe('other-value');
  });

  it('should update value when change event occurs', async () => {
    const { getByRole } = render(createElement(createTestInput()));
    const input = getByRole('textbox');

    expect(input).toHaveValue('');

    fireEvent.change(input, { target: { value: 'changed' } });
    expect(input).toHaveValue('changed');

    fireEvent.change(input, { target: { value: 'one more changed' } });
    expect(input).toHaveValue('one more changed');
  });

  it('should transform value according to the provided function', async () => {
    const { getByRole } = render(createElement(createTestInput('', v => v.toUpperCase())));

    const input = getByRole('textbox');
    fireEvent.change(input, { target: { value: 'must be uppercase' } });

    expect(input).toHaveValue('MUST BE UPPERCASE');
  });

  it('should update value when change event occurs on a textarea', async () => {
    const { getByRole } = render(createElement(createTestTextarea()));
    const textarea = getByRole('textbox');

    expect(textarea).toHaveValue('');

    fireEvent.change(textarea, { target: { value: 'changed' } });
    expect(textarea).toHaveValue('changed');
  });

  it('should initialize value using a lazy initializer', () => {
    const { result } = renderHookSSR(() => useInputState(() => 'initial-value'));
    const [value] = result.current;

    expect(value).toBe('initial-value');
  });

  it('should call the lazy initializer only on initial render', () => {
    const initializer = vi.fn(() => 'initial-value');
    const { rerender } = renderHookSSR(() => useInputState(initializer));

    rerender();

    expect(initializer).toHaveBeenCalledTimes(1);
  });
});
