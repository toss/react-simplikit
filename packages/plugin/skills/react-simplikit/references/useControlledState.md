# useControlledState

`useControlledState` is a React hook that allows you to control both controlled and uncontrolled states. If you pass the state to `value`, it will be a controlled state, and if you pass the state to `defaultValue`, it will be an uncontrolled state. If both `value` and `defaultValue` are passed, `value` will take precedence.

## Interface

```ts
function useControlledState(props: Object): [T, Dispatch<SetStateAction<T>>];
```

### Parameters

<Interface
  required
  name="props"
  type="Object"
  description=""
  :nested="[
    {
      name: 'props.value',
      type: 'T',
      required: false,
      description: 'The value of the state.',
    },
    {
      name: 'props.defaultValue',
      type: 'T',
      required: false,
      description: 'The default value of the state.',
    },
    {
      name: 'props.onChange',
      type: '(value: T) => void',
      required: false,
      description:
        'The callback function that is called when the state changes.',
    },
    {
      name: 'props.equalityFn',
      type: '(prev: T, next: T) => boolean',
      required: false,
      description:
        'The function that is used to compare the previous and next values.',
    },
  ]"
/>

### Return Value

<Interface
  name=""
  type="[T, Dispatch<SetStateAction<T>>]"
  description="The state and the setter function."
/>

## Example

```tsx
type ToggleProps = {
  value?: boolean;
  defaultValue?: boolean;
  onChange?: (value: boolean) => void;
};

function Toggle({ value, defaultValue, onChange }: ToggleProps) {
  const [on, setOn] = useControlledState({
    value,
    defaultValue: defaultValue ?? false,
    onChange,
  });

  return (
    <button onClick={() => setOn(prev => !prev)}>{on ? 'ON' : 'OFF'}</button>
  );
}
```
