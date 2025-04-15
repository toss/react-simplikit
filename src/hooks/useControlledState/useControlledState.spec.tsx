import { useState } from 'react';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useControlledState } from './useControlledState.ts';

describe('useControlledState', () => {
  it('is safe on server side rendering', async () => {
    const result = renderHookSSR.serverOnly(() => useControlledState({ defaultValue: 'testing' }));
    const [value] = result.current;
    expect(value).toBe('testing');
  });

  it('should be uncontrolled when defaultValue is passed', () => {
    const { result } = renderHookSSR(() => useControlledState({ defaultValue: 'testing' }));
    const [value] = result.current;
    expect(value).toBe('testing');

    act(() => {
      const [, setValue] = result.current;
      setValue('naruto');
    });

    const [next] = result.current;
    expect(next).toBe('naruto');
  });

  it('should be controlled when value is passed', () => {
    const { result } = renderHookSSR(() => useControlledState({ value: 'testing' }));
    const [value] = result.current;
    expect(value).toBe('testing');

    act(() => {
      const [, setValue] = result.current;
      setValue('naruto');
    });

    const [next] = result.current;
    expect(next).toBe('testing');
  });

  it('onChange does not become stale when callback is updated', async () => {
    type ControllableProps = {
      value: number;
      onChange: (next: number) => void;
    };

    function Child({ value, onChange }: ControllableProps) {
      const [state, setState] = useControlledState({ value, onChange });

      return (
        <div>
          <p data-testid="value">{value}</p>
          <input type="text" value={state} onChange={e => setState(Number(e.target.value))} />
        </div>
      );
    }

    function App() {
      const [value, setValue] = useState(0);
      const onChange = (next: number) => {
        setValue(value + next);
      };

      return <Child value={value} onChange={onChange} />;
    }

    render(<App />);
    expect(screen.getByTestId('value')).toHaveTextContent('0');
  });

  it('should not change when the value is the same', () => {
    const { result } = renderHookSSR(() => useControlledState({ value: 'testing' }));
    const [value] = result.current;
    expect(value).toBe('testing');

    act(() => {
      const [, setValue] = result.current;
      setValue('testing');
    });

    const [next] = result.current;
    expect(next).toBe('testing');
  });

  it('should handle controlled undefined value correctly', () => {
    const { result } = renderHookSSR(() =>
      useControlledState({
        value: 'test',
        onChange: () => {},
      })
    );

    act(() => {
      const [, setValue] = result.current;
      setValue(undefined as never);
    });

    const [value] = result.current;
    expect(value).toBe('test');
  });

  it('should handle function setState action', () => {
    const { result } = renderHookSSR(() => useControlledState({ defaultValue: 5 }));
    const [value] = result.current;
    expect(value).toBe(5);

    act(() => {
      const [, setValue] = result.current;
      setValue(prev => prev + 3);
    });

    const [nextValue] = result.current;
    expect(nextValue).toBe(8);
  });
});
