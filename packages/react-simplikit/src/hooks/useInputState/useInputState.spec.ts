import { ChangeEvent, createElement, StrictMode, useState } from 'react';
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

  it('should provide the previous value to the transform function', () => {
    const { getByRole } = render(
      createElement(
        createTestInput('value', (nextValue, previousValue) => (nextValue.length > 5 ? previousValue : nextValue))
      )
    );

    const input = getByRole('textbox');
    fireEvent.change(input, { target: { value: 'values' } });

    expect(input).toHaveValue('value');
  });

  it('should call transformValue once per change in StrictMode', () => {
    const transformValue = vi.fn((nextValue: string) => nextValue);
    const { getByRole } = render(createElement(StrictMode, null, createElement(createTestInput('', transformValue))));

    fireEvent.change(getByRole('textbox'), { target: { value: 'a' } });

    expect(transformValue).toHaveBeenCalledTimes(1);
  });

  it('should let transformValue update another component', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    function Input({ onTooLong }: { onTooLong: (tooLong: boolean) => void }) {
      const [, setTouched] = useState(false);
      const [value, onChange] = useInputState('', (nextValue, previousValue) => {
        onTooLong(nextValue.length > 3);
        return nextValue.length > 3 ? previousValue : nextValue;
      });

      return createElement('input', {
        value,
        onChange: (event: ChangeEvent<HTMLInputElement>) => {
          setTouched(true);
          onChange(event);
        },
      });
    }

    function Form() {
      const [tooLong, setTooLong] = useState(false);
      return createElement('div', null, createElement(Input, { onTooLong: setTooLong }), tooLong ? 'too long' : '');
    }

    const { getByRole, getByText } = render(createElement(Form));
    fireEvent.change(getByRole('textbox'), { target: { value: 'abcd' } });

    expect(getByText('too long')).toBeInTheDocument();
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('should pass the latest state as previousValue', () => {
    const { getByRole } = render(
      createElement(
        createTestInput('', (nextValue, previousValue) => (nextValue.length > 3 ? previousValue : nextValue))
      )
    );
    const input = getByRole('textbox');

    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.change(input, { target: { value: 'abcd' } });

    expect(input).toHaveValue('abc');
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
