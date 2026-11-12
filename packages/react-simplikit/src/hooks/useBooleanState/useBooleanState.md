# useBooleanState

`useBooleanState` is a React hook that simplifies managing a boolean state.
It provides functions to set the state to `true`, set it to `false`, and toggle its value.

## Interface

```ts
function useBooleanState(
  initialValue: boolean | (() => boolean) = false
): readonly [state: boolean, actions: BooleanStateActions];
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
  type="readonly [state: boolean, actions: BooleanStateActions]"
  description="A tuple containing the state and actions to change it."
  :nested="[
    {
      name: 'state',
      type: 'boolean',
      required: false,
      description: 'The current state value.',
    },
    {
      name: 'actions.setTrue',
      type: '() => void',
      required: false,
      description: 'A function to set the state to <code>true</code>.',
    },
    {
      name: 'actions.setFalse',
      type: '() => void',
      required: false,
      description: 'A function to set the state to <code>false</code>.',
    },
    {
      name: 'actions.toggle',
      type: '() => void',
      required: false,
      description: 'A function to toggle the state.',
    },
  ]"
/>

## Example

```tsx
const [open, { setTrue: openBottomSheet, setFalse: closeBottomSheet }] =
  useBooleanState(false);
```
