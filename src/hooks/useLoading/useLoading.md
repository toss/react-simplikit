# useLoading

`useLoading` is a React hook that helps manage the loading state of a `Promise` easily. It provides a state to check whether an asynchronous operation is in progress, along with functions to handle the loading state.

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

- `<T>(promise: Promise<T>) => Promise<T>`: This is a function that executes asynchronous tasks while managing the loading state.

## Examples

```tsx
import { useLoading } from 'reactive-kit';

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
