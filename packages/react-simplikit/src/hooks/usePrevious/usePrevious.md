# usePrevious

`usePrevious` is a React hook that returns the previous value of the input state.
It preserves the previous value unchanged when re-renders occur without state changes.
If the state is an object or requires custom change detection, an `equalityFn` can be provided.
By default, state changes are detected using `Object.is(prev, next)`.

## Interface

```ts
function usePrevious<T>(
  state: T,
  equalityFn?: (prev: T, next: T) => boolean
): T;
```

### Parameters

<Interface
  required
  name="state"
  type="T"
  description="The state whose previous value is to be tracked."
/>

<Interface
  name="equalityFn"
  type="(prev: T, next: T) => boolean"
  description="An optional function to determine if two states are equal. By default, it uses <code>Object.is</code> for comparison."
/>

### Return Value

<Interface name="" type="T" description="The previous value of the state." />

## Example

```tsx
const [count, setCount] = useState(0);
// initial value of previousCount is `0`
const previousCount = usePrevious(count);
```
