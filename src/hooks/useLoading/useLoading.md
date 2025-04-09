# useLoading

`useLoading` is a React hook that simplifies managing the loading state.
It provides a state to track whether an asynchronous operation is in progress and a function to handle the loading state automatically.

## Interface

```ts
function useLoading(): [
  boolean, // Loading state value
  <T>(promise: Promise<T>) => Promise<T>, // Function that manages the loading state and executes asynchronous tasks
];
```

### Returns

Returns a tuple of the form `[boolean, <T>(promise: Promise<T>) => Promise<T>]`:

- `boolean`: Represents the current loading state. It is set to `true` when an asynchronous task is in progress.

- `<T>(promise: Promise<T>) => Promise<T>`: A function that executes asynchronous tasks while managing the loading state automatically.

## Examples

```tsx
import { useLoading } from 'react-simplikit';

function ConfirmButton() {
  const [loading, startLoading] = useLoading();

  const handleSubmit = useCallback(async () => {
    try {
      const result = await startLoading(postConfirmation());
      router.push(`/success?id=${result.id}`);
    } catch (error) {
      console.error('Error:', error);
    }
  }, [startLoading, data]);

  return (
    <button disabled={loading} onClick={handleSubmit}>
      {loading ? 'loading...' : 'Confirm'}
    </button>
  );
}
```
