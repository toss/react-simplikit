# useInputState

`useInputState` is a React hook that manages an input state with optional value transformation. The returned `onChange` handler works with both `<input>` and `<textarea>` elements.

## Interface

```ts
function useInputState(
  initialValue: string = '',
  transformValue: (value: string) => string = (v: string) => v
): [
  value: string,
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
];
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
  type="[value: string, onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>]"
  description="tuple containing:"
  :nested="[
    {
      name: 'value',
      type: 'string',
      required: false,
      description: 'The current state value.',
    },
    {
      name: 'onChange',
      type: 'ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>',
      required: false,
      description: 'A function to update the state.',
    },
  ]"
/>

## Example

```tsx
function Example() {
  const [value, onChange] = useInputState('');
  return (
    <>
      <input type="text" value={value} onChange={onChange} />
      <textarea value={value} onChange={onChange} />
    </>
  );
}
```
