# useAsyncLock

`useAsyncLock` is a React hook that prevents overlapping execution of asynchronous work. While one callback is running, additional calls are skipped and return a blocked result.

## Interface

```ts
function useAsyncLock(): {
  runWithLock: <T>(
    callback: () => Promise<T> | T
  ) => Promise<{ status: 'executed'; data: T } | { status: 'blocked' }>;
  isLocked: () => boolean;
};
```

### Parameters

### Return Value

<Interface
name=""
type="{ runWithLock: <T>(callback: () => Promise<T> | T) => Promise<AsyncLockResult<T>>, isLocked: () => boolean }"
description="An object containing helpers to run work with a lock."
:nested="[
{
name: 'runWithLock',
type: '<T>(callback: () => Promise<T> | T) => Promise<AsyncLockResult<T>>',
description:
'Runs the callback when the lock is available. If another callback is already running, it returns <code>{ status: \"blocked\" }</code> without calling the callback.',
},
{
name: 'isLocked',
type: '() => boolean',
description: 'Returns whether the lock is currently held.',
},
]"
/>

## Example

```tsx
function SubmitButton() {
  const { runWithLock } = useAsyncLock();

  const handleClick = async () => {
    const result = await runWithLock(async () => {
      return submitForm();
    });

    if (result.status === 'blocked') {
      return;
    }

    console.log(result.data);
  };

  return <button onClick={handleClick}>Submit</button>;
}
```
