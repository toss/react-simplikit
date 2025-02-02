import { createElement } from 'react';
import { fireEvent, render, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useInputState } from './useInputState.ts';

function createTestInput(...params: Parameters<typeof useInputState>) {
  return function Input() {
    const [value, handleValueChange] = useInputState(...params);

    return createElement('input', {
      'data-testid': 'input',
      type: 'text',
      value,
      onChange: handleValueChange,
    });
  };
}

describe('useInputState', () => {
  it('should return empty string for initial value when no argument is provided', () => {
    const { result } = renderHook(() => useInputState());
    const [value] = result.current;

    expect(value).toBe('');
  });

  it('should return the provided value until input changes', () => {
    const { result: result1 } = renderHook(() => useInputState('some-value'));
    expect(result1.current[0]).toBe('some-value');

    const { result: result2 } = renderHook(() => useInputState('other-value'));
    expect(result2.current[0]).toBe('other-value');
  });
});

it('should update value when change event occurs', () => {
  const { getByTestId } = render(createElement(createTestInput()));
  const input = getByTestId('input') as HTMLInputElement;

  expect(input.value).toBe('');

  fireEvent.change(input, { target: { value: 'changed' } });
  expect(input.value).toBe('changed');

  fireEvent.change(input, { target: { value: 'one more changed' } });
  expect(input.value).toBe('one more changed');
});

it('should transform value according to the provided function', () => {
  const { getByTestId } = render(createElement(createTestInput('', v => v.toUpperCase())));

  const input = getByTestId('input') as HTMLInputElement;
  fireEvent.change(input, { target: { value: 'must be uppercase' } });

  expect(input.value).toBe('MUST BE UPPERCASE');
});
