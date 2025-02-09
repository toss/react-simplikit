# usePreservedReference

`usePreservedReference` is a React hook that helps you maintain the reference of a value when it hasn't changed, while ensuring you can safely use the latest state. It prevents unnecessary re-renders while always allowing access to the latest data.

## Interface

```typescript
function usePreservedReference<T>(value: T, areValuesEqual?: (a: T, b: T) => boolean): T;
```

### Parameters

- `value`: The value to maintain the reference for. It returns a new reference if the state value changes after comparison.
- `areValuesEqual`: An optional function to determine if two values are equal. By default, it uses `JSON.stringify` for comparison.

### Returns

Returns the same reference if the value is considered equal to the previous one, otherwise returns a new reference.

## Usage Examples

### Basic Usage

Below is an example of using the hook to maintain a reference to an object.

```tsx
import { usePreservedReference } from 'reactive-kit';
import { useState } from 'react';

function ExampleComponent() {
  const [state, setState] = useState({ key: 'value' });

  const preservedState = usePreservedReference(state);

  return <div>{preservedState.key}</div>;
}
```

### Custom Equality Function

This example shows how to use a custom equality function.

```tsx
import { usePreservedReference } from 'reactive-kit';
import { useState } from 'react';

function ExampleComponent() {
  const [state, setState] = useState({ key: 'value' });

  const preservedState = usePreservedReference(state, (a, b) => a.key === b.key);

  return <div>{preservedState.key}</div>;
}
```
