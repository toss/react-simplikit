# mergeRefs

`mergeRefs` is a utility function that combines multiple React refs into a single ref. This is particularly useful when you need to attach multiple refs to a single element.

## Interface

```ts
function mergeRefs<T>(...refs: Array<RefObject<T> | RefCallback<T>>): RefCallback<T>;
```

### Parameters

- `refs` (`Array<RefObject<T> | RefCallback<T>>`): An array of refs to be merged. Each ref can be either a `RefObject` or a `RefCallback`.

### Returns

Returns a `RefCallback<T>` that updates all provided refs when called.

## Example

### Basic Usage

```tsx
import { forwardRef, useRef } from 'react';
import { mergeRefs } from 'reactie';

const Component = forwardRef((props, parentRef) => {
  const localRef = useRef(null);

  return <div ref={mergeRefs(localRef, parentRef)}>Content</div>;
});
```

### Usage with `useCallback`

```tsx
import { useCallback, useRef } from 'react';
import { mergeRefs } from 'reactie';

const Component = () => {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback(node => {
    setHeight(node?.offsetHeight ?? 0);
  }, []);

  return <div ref={mergeRefs(measuredRef, ref)} />;
};
```
