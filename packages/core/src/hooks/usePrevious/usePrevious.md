# usePrevious

`usePrevious` is a React hook that returns the previous value of the input state. It preserves the previous value unchanged when re-render occur without state changes. If the state is an object or requires custom change detection, a `compare` function can be provided. By default, state changes are detected using `prev === next`.

## Interface

```ts
function usePrevious<T>(state: T, compare: (prev: T, next: T) => boolean): T;
```

### Parameters

<Interface
  required
  name="state"
  type="T"
  description="The state whose previous value is to be tracked."
/>

<Interface
  name="compare"
  type="(prev: T, next: T) => boolean"
  description="An optional comparison function to determine if the state has changed."
/>

### Return Value

<Interface
  name=""
  type="T"
  description="previous value of the state."
/>

## Example

```tsx
const [count, setCount] = useState(0);
// initial value of previousCount is `0`
const previousCount = usePrevious(count);
```
