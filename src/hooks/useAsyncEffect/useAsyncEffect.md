# useAsyncEffect

`useAsyncEffect` is a custom hook for handling asynchronous side effects in React components.
It follows the same cleanup pattern as `useEffect` while ensuring that async operations are handled safely.
This hook allows you to write cleaner and more reliable async code inside React components.

## Interface

```ts
function useAsyncEffect(effect: () => Promise<void | (() => void)>, deps?: DependencyList): void;
```

### Parameters

- `effect` (`() => Promise<void | (() => void)>`): An asynchronous function executed within the `useEffect` pattern.  
  This function can return a cleanup function, just like in `useEffect`.
- `deps` (`DependencyList`): A dependency array.  
  The effect is re-executed whenever any value in this array changes.  
  If omitted, the effect runs only once when the component mounts.

### Return value

This hook does not return anything.

## Example

```tsx
import { useAsyncEffect } from 'react-simplikit';

function Component() {
  const [data, setData] = useState<Data | null>(null);

  useAsyncEffect(async () => {
    const data = await fetchData();
    setData(data);

    return () => {
      // cleanup logic
    };
  }, [dependency]);

  return (
    <div>
      <p>Data: {data}</p>
    </div>
  );
}
```
