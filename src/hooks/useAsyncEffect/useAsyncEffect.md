# useAsyncEffect

`useAsyncEffect` is a React hook for handling asynchronous side effects in React components. It follows the same cleanup pattern as `useEffect` while ensuring async operations are handled safely.

## Interface

```ts
function useAsyncEffect(
  effect: () => Promise<void | (() => void)>,
  deps: DependencyList
): void;
```

### Parameters

<Interface
  name="effect"
  type="() => Promise<void | (() => void)>"
  description="An asynchronous function executed in the <code>useEffect</code> pattern. This function can optionally return a cleanup function."
/>

<Interface
  name="deps"
  type="DependencyList"
  description="A dependency array. The effect will re-run whenever any value in this array changes. If omitted, the effect will run on every component re-render."
/>

### Return Value

This hook does not return anything.

## Example

```tsx
useAsyncEffect(async () => {
  const data = await fetchData();
  setData(data);

  return () => {
    console.log('Cleanup on unmount or dependencies change');
  };
}, [dependencies]);
```
