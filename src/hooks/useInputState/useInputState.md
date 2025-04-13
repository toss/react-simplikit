# useInputState

`useInputState` is a React hook that manages an input state with optional value transformation.

## Interface

```ts
function useInputState(
  initialValue: string = '',
  transformValue: (value: string) => string = (v: string) => v
): [value: string, onChange: (value: string) => void];
```

### Parameters

<Interface
  name="initialValue"
  type="string"
  description='The initial value of the input. Defaults to an empty string (<code>""</code>).'
/>

<Interface
  name="transformValue"
  type="(value: string) => string"
  description="A function to transform the input value. Defaults to an identity function that returns the input unchanged."
/>

### Return Value

<Interface
  name=""
  type="[value: string, onChange: (value: string) => void]"
  description="tuple containing:"
  :nested="[
    {
      name: 'value',
      type: 'string',
      description: 'The current state value.',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      description: 'A function to update the state.',
    },
  ]"
/>

## Example

```tsx
function Example() {
  const [value, setValue] = useInputState('');
  return <input type="text" value={value} onChange={setValue} />;
}
```
