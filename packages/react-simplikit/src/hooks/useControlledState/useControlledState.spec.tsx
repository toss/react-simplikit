import { useLayoutEffect, useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useControlledState } from './useControlledState.ts';

describe('useControlledState', () => {
  it('is safe on server side rendering', async () => {
    const result = renderHookSSR.serverOnly(() => useControlledState({ defaultValue: 'testing' }));
    const [value] = result.current;
    expect(value).toBe('testing');
  });

  it('should be uncontrolled when defaultValue is passed', async () => {
    const { result } = renderHookSSR(() => useControlledState({ defaultValue: 'testing' }));
    const [value] = result.current;
    expect(value).toBe('testing');

    await act(async () => {
      const [, setValue] = result.current;
      setValue('naruto');
    });

    const [next] = result.current;
    expect(next).toBe('naruto');
  });

  it('should be controlled when value is passed', async () => {
    const { result } = renderHookSSR(() => useControlledState({ value: 'testing' }));
    const [value] = result.current;
    expect(value).toBe('testing');

    await act(async () => {
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

  it('should not change when the value is the same', async () => {
    const { result } = renderHookSSR(() => useControlledState({ value: 'testing' }));
    const [value] = result.current;
    expect(value).toBe('testing');

    await act(async () => {
      const [, setValue] = result.current;
      setValue('testing');
    });

    const [next] = result.current;
    expect(next).toBe('testing');
  });

  it('should handle controlled undefined value correctly', async () => {
    const { result } = renderHookSSR(() =>
      useControlledState({
        value: 'test',
        onChange: () => {},
      })
    );

    await act(async () => {
      const [, setValue] = result.current;
      setValue(undefined as never);
    });

    const [value] = result.current;
    expect(value).toBe('test');
  });

  it('should handle function setState action', async () => {
    const { result } = renderHookSSR(() => useControlledState({ defaultValue: 5 }));
    const [value] = result.current;
    expect(value).toBe(5);

    await act(async () => {
      const [, setValue] = result.current;
      setValue(prev => prev + 3);
    });

    const [nextValue] = result.current;
    expect(nextValue).toBe(8);
  });

  it('applies multiple function setState actions in order when uncontrolled', async () => {
    const onChange = vi.fn();
    const { result } = renderHookSSR(() => useControlledState({ defaultValue: 5, onChange }));

    await act(async () => {
      const [, setValue] = result.current;
      setValue(prev => prev + 3);
      setValue(prev => prev + 3);
    });

    const [nextValue] = result.current;
    expect(nextValue).toBe(11);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(11);
  });

  it('does not call onChange on mount when uncontrolled', () => {
    const onChange = vi.fn();
    renderHookSSR(() => useControlledState({ defaultValue: 5, onChange }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not call onChange for a value equalityFn treats as equal when uncontrolled', async () => {
    const onChange = vi.fn();
    const { result } = renderHookSSR(() =>
      useControlledState({
        defaultValue: { id: 1 },
        onChange,
        equalityFn: (prev, next) => prev.id === next.id,
      })
    );

    const [initialValue] = result.current;

    await act(async () => {
      const [, setValue] = result.current;
      setValue({ id: 1 });
    });

    expect(onChange).not.toHaveBeenCalled();
    expect(result.current[0]).toBe(initialValue);
  });

  it('reflects a value the parent changes externally when controlled', () => {
    function App() {
      const [checked, setChecked] = useState(true);
      const [value] = useControlledState({ value: checked, onChange: setChecked });

      return (
        <div>
          <p data-testid="value">{String(value)}</p>
          <button onClick={() => setChecked(false)}>Clear value</button>
        </div>
      );
    }

    render(<App />);
    expect(screen.getByTestId('value')).toHaveTextContent('true');

    fireEvent.click(screen.getByText('Clear value'));
    expect(screen.getByTestId('value')).toHaveTextContent('false');
  });

  it('toggles with a function setState action through the parent when controlled', () => {
    const onChange = vi.fn();
    function App() {
      const [checked, setChecked] = useState(false);
      const [value, setValue] = useControlledState({
        value: checked,
        onChange: next => {
          onChange(next);
          setChecked(next);
        },
      });

      return <button role="checkbox" aria-checked={value} onClick={() => setValue(prev => !prev)} />;
    }

    render(<App />);
    fireEvent.click(screen.getByRole('checkbox'));

    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('does not re-render after the parent rejects a change when controlled', () => {
    let renderCount = 0;
    function App() {
      renderCount += 1;
      const [value, setValue] = useState(10);
      const [state, setState] = useControlledState({
        value,
        onChange: next => setValue(Math.min(next, 10)),
      });

      useLayoutEffect(function pushEveryRender() {
        setState(12);
      });

      return <p data-testid="value">{state}</p>;
    }

    render(<App />);

    expect(screen.getByTestId('value')).toHaveTextContent('10');
    expect(renderCount).toBe(1);
  });

  it('calls onChange once when setValue(undefined) switches from controlled back to uncontrolled', () => {
    const onChange = vi.fn();
    function App() {
      const [prop, setProp] = useState<string | undefined>(undefined);
      const [value, setValue] = useControlledState<string | undefined>({
        value: prop,
        defaultValue: 'a',
        onChange: next => {
          onChange(next);
          setProp(next);
        },
      });

      return (
        <div>
          <p data-testid="value">{String(value)}</p>
          <button data-testid="control" onClick={() => setProp('b')} />
          <button data-testid="clear" onClick={() => setValue(undefined)} />
        </div>
      );
    }

    render(<App />);
    fireEvent.click(screen.getByTestId('control'));
    expect(screen.getByTestId('value')).toHaveTextContent('b');

    fireEvent.click(screen.getByTestId('clear'));
    expect(screen.getByTestId('value')).toHaveTextContent('undefined');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it('does not call onChange on mount when equalityFn is not reflexive when uncontrolled', () => {
    const onChange = vi.fn();
    renderHookSSR(() => useControlledState({ defaultValue: 5, onChange, equalityFn: () => false }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('notifies through the latest onChange after the parent swaps it when uncontrolled', async () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = renderHookSSR(
      ({ onChange }: { onChange: (next: number) => void }) => useControlledState({ defaultValue: 5, onChange }),
      { initialProps: { onChange: first } }
    );

    rerender({ onChange: second });
    await act(async () => {
      const [, setValue] = result.current;
      setValue(6);
    });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith(6);
  });

  it('notifies a change back to the initial value when uncontrolled', async () => {
    const onChange = vi.fn();
    const { result } = renderHookSSR(() => useControlledState({ defaultValue: 5, onChange }));

    await act(async () => {
      const [, setValue] = result.current;
      setValue(6);
    });
    await act(async () => {
      const [, setValue] = result.current;
      setValue(5);
    });

    expect(onChange.mock.calls).toEqual([[6], [5]]);
  });

  it('notifies a change made in the same event the parent takes control', () => {
    const onChange = vi.fn();
    function App() {
      const [prop, setProp] = useState<string | undefined>(undefined);
      const [value, setValue] = useControlledState<string | undefined>({ value: prop, defaultValue: 'a', onChange });

      return (
        <div>
          <p data-testid="value">{String(value)}</p>
          <button
            data-testid="take"
            onClick={() => {
              setValue('b');
              setProp('b');
            }}
          />
          <button data-testid="release" onClick={() => setProp(undefined)} />
        </div>
      );
    }

    render(<App />);
    fireEvent.click(screen.getByTestId('take'));
    expect(screen.getByTestId('value')).toHaveTextContent('b');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('b');

    fireEvent.click(screen.getByTestId('release'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('computes a function update from the value prop, not the internal state, when controlled', () => {
    const onChange = vi.fn();
    function App() {
      const [count, setCount] = useState(5);
      const [value, setValue] = useControlledState({
        value: count,
        defaultValue: 0,
        onChange: next => {
          onChange(next);
          setCount(next);
        },
      });

      return <button onClick={() => setValue(prev => prev + 3)}>{value}</button>;
    }

    render(<App />);
    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('button')).toHaveTextContent('8');
    expect(onChange).toHaveBeenCalledWith(8);
  });
});
