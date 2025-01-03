# useAsyncEffect

`useAsyncEffect` is a hook for handling async effects in React components. It follows the same cleanup pattern as `useEffect` while safely handling async operations.

## Interface

```ts
function useAsyncEffect(effect: () => Promise<void | (() => void)>, deps?: DependencyList): void;
```

### Parameters

- `effect` (`() => Promise<void | (() => void)>`): an async function to be executed in useEffect pattern.
- `deps` (`DependencyList`): a dependency array.

### Return value

This hook does not return anything.

## Example

```tsx
import { useAsyncEffect } from 'reactie';

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
