# useBooleanState

`useBooleanState` is a React hook that simplifies managing a boolean state. It provides functions to set the state to `true`, set it to `false`, and toggle its value.

## Interface

```ts
function useBooleanState(
  defaultValue: boolean = false
): [state: boolean, setTrue: () => void, setFalse: () => void, toggle: () => void];
```

### Parameters

<Interface
  name="defaultValue"
  type="boolean"
  description="The initial value of the state. Defaults to <code>false</code>."
/>

### Return Value

<Interface
  name=""
  type="[state: boolean, setTrue: () => void, setFalse: () => void, toggle: () => void]"
  description="tuple containing:"
  :nested="[
    {
      name: 'state',
      type: 'boolean',
      description: 'The current state value.',
    },
    {
      name: 'setTrue',
      type: '() => void',
      description: 'A function to set the state to <code>true</code>.',
    },
    {
      name: 'setFalse',
      type: '() => void',
      description: 'A function to set the state to <code>false</code>.',
    },
    {
      name: 'toggle',
      type: '() => void',
      description: 'A function to toggle the state.',
    },
  ]"
/>

## Example

```tsx
const [open, openBottomSheet, closeBottomSheet, toggleBottomSheet] = useBooleanState(false);
```
