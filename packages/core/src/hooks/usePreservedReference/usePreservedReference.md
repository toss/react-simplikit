# usePreservedReference

`usePreservedReference` is a React hook that helps maintain the reference of a value when it hasn't changed, while ensuring you can safely use the latest state. It prevents unnecessary re-renders while always allowing access to the latest data.

## Interface

```ts
function usePreservedReference<T extends NotNullishValue>(
  value: T,
  areValuesEqual: (a: T, b: T) => boolean
): T;
```

### Parameters

<Interface
  required
  name="value"
  type="T"
  description="The value to maintain the reference for. It returns a new reference if the state value changes after comparison."
/>

<Interface
  name="areValuesEqual"
  type="(a: T, b: T) => boolean"
  description="An optional function to determine if two values are equal. By default, it uses <code>JSON.stringify</code> for comparison."
/>

### Return Value

<Interface
  name=""
  type="T"
  description="the same reference if the value is considered equal to the previous one, otherwise returns a new reference."
/>

## Example

```tsx
import { usePreservedReference } from 'react-simplikit';
import { useState } from 'react';

function ExampleComponent() {
  const [state, setState] = useState({ key: 'value' });

  const preservedState = usePreservedReference(state);

  return <div>{preservedState.key}</div>;
}
```
