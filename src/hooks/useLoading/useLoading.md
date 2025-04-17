# useLoading

`useLoading` is a React hook that simplifies managing the loading state of a `Promise`. It provides a state to track whether an asynchronous operation is in progress and a function to handle the loading state automatically.

## Interface

```ts
function useLoading(): [
  loading: boolean,
  startLoading: <T>(promise: Promise<T>) => Promise<T>,
];
```

### Parameters

### Return Value

<Interface
  name=""
  type="[loading: boolean, startLoading: <T>(promise: Promise<T>) => Promise<T>]"
  description="tuple containing:"
  :nested="[
    {
      name: 'loading',
      type: 'boolean',
      description:
        'Represents the current loading state. <br />  : The initial value is <code>false</code>. <br />  : It is set to <code>true</code> when an asynchronous task is in progress.',
    },
    {
      name: 'startLoading',
      type: '<T>(promise: Promise<T>) => Promise<T>',
      description:
        'A function that executes asynchronous tasks while managing the loading state. <br />  : This function takes a <code>Promise</code> as an argument and automatically resets the <code>isLoading</code> state to <code>false</code> when the <code>Promise</code> completes.',
    },
  ]"
/>

## Example

```tsx
function ConfirmButton() {
  const [loading, startLoading] = useLoading();

  const handleSubmit = useCallback(async () => {
    try {
      const result = await startLoading(postConfirmation());
      router.push(`/success?id=${result.id}`);
    } catch (error) {
      console.error('Error:', error);
    }
  }, [startLoading]);

  return (
    <button disabled={loading} onClick={handleSubmit}>
      {loading ? 'Loading...' : 'Confirm'}
    </button>
  );
}
```
