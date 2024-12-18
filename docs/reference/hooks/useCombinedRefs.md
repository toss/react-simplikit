# useCombinedRefs

`useCombinedRefs` is a React hook that combines multiple refs into a single ref. It updates all provided refs when the combined ref updates.

## Interface

```ts
function useCombinedRefs<T>(...refs: Array<React.Ref<T> | ((instance: T | null) => void)>): React.Ref<T>;
```

### Parameters

- `...refs` (`Array<React.Ref<T> | CallbackRef<T>>`): Multiple refs to be combined.

### 반환 값

Returns a combined ref that updates all provided refs.

## Examples

```tsx
import { forwardRef, useRef } from 'react';
import { useCombinedRefs } from '@tossteam/react';

const Component = forwardRef((props, parentRef) => {
  const localRef = useRef(null);
  const combinedRef = useCombinedRefs(localRef, parentRef);

  return <div ref={combinedRef}>Hello World</div>;
});
```
