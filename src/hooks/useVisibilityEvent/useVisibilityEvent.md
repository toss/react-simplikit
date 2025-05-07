# useVisibilityEvent

`useVisibilityEvent` is a React hook that listens to changes in the document's visibility state and triggers a callback.

## Interface

```ts
function useVisibilityEvent(
  callback: (visibilityState: 'visible' | 'hidden') => void,
  options: object
): void;
```

### Parameters

<Interface
  required
  name="callback"
  type="(visibilityState: 'visible' | 'hidden') => void"
  description="A function to be called when the visibility state changes. It receives the current visibility state ('visible' or 'hidden') as an argument."
/>

<Interface
  name="options"
  type="object"
  description="Optional configuration for the hook."
  :nested="[
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        'If true, the callback is invoked immediately upon mounting with the current visibility state.',
    },
  ]"
/>

### Return Value

This hook does not return anything.

## Example

```tsx
import { useVisibilityEvent } from 'react-simplikit';

function Component() {
  useVisibilityEvent(visibilityState => {
    console.log(`Document is now ${visibilityState}`);
  });

  return <p>Check the console for visibility changes.</p>;
}
```
