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

The function returns a tuple of the form `[boolean, <T>(promise: Promise<T>) => Promise<T>]`:

1. `boolean`: Represents the current loading state.

- The initial value is `false`.
  0 It is set to `true` when an asynchronous task is in progress.

2. `<T>(promise: Promise<T>) => Promise<T>`: This is a function that executes asynchronous tasks while managing the loading state.

- This function takes a `Promise` as an argument and sets the `isLoading` state to `false` when the `Promise` is completed.

## Examples

```tsx
import { useLoading } from 'reactie';

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
