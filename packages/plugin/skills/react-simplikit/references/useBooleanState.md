# useBooleanState

`useBooleanState` is a React hook that simplifies managing a boolean state.
It provides functions to set the state to `true`, set it to `false`, and toggle its value.

## Interface

```ts
function useBooleanState(initialValue: boolean | (() => boolean) = false): {
  value: boolean;
  setTrue: () => void;
  setFalse: () => void;
  toggle: () => void;
};
```

### Parameters

<Interface
  name="initialValue"
  type="boolean | (() => boolean)"
  description="The initial value of the state. Defaults to <code>false</code>."
/>

### Return Value

<Interface
  name=""
  type="{ value: boolean; setTrue: () => void; setFalse: () => void; toggle: () => void }"
  description="An object containing:"
  :nested="[
    {
      name: 'value',
      type: 'boolean',
      required: false,
      description: 'The current state value.',
    },
    {
      name: 'setTrue',
      type: '() => void',
      required: false,
      description: 'A function to set the state to <code>true</code>.',
    },
    {
      name: 'setFalse',
      type: '() => void',
      required: false,
      description: 'A function to set the state to <code>false</code>.',
    },
    {
      name: 'toggle',
      type: '() => void',
      required: false,
      description: 'A function to toggle the state.',
    },
  ]"
/>

## Example

```tsx
const {
  value: open,
  setTrue: openBottomSheet,
  setFalse: closeBottomSheet,
  toggle: toggleBottomSheet,
} = useBooleanState(false);
```
