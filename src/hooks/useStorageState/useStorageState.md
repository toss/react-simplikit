# useStorageState

`useStorageState` is a React hook that simplifies managing persistent state using browser storage.
It allows you to store and retrieve values from `localStorage` or `sessionStorage` as if they were React state.

## Interface

```ts
function useStorageState<T>(
  key: string
): readonly [Serializable<T> | undefined, (value: SetStateAction<Serializable<T> | undefined>) => void];

function useStorageState<T>(
  key: string,
  options: StorageStateOptions<T>
): readonly [Serializable<T> | undefined, (value: SetStateAction<Serializable<T> | undefined>) => void];
```

## Parameters

- `key` (`string`): The key used to store the value in the browser storage.
- `options` (`StorageStateOptions<T>`, optional):
  - `storage` (`Storage`): The storage type (`localStorage` or `sessionStorage`). Defaults to `localStorage`.
  - `defaultValue` (`T`): The initial value if no existing value is found.

## Returns

Returns a tuple of the form `[state, setState]`:

- `state` (`Serializable<T> | undefined`): The current value stored in the storage.
- `setState` (`(value: SetStateAction<Serializable<T> | undefined>) => void`): A function to update the stored value.

## Notes

- Stored values must be JSON serializable.
- When using `localStorage`, updates are automatically synchronized across browser tabs.
- If the stored data is invalid JSON, the default value is returned.
- Uses caching to minimize unnecessary JSON parsing.
- Listens for storage events to sync state between tabs.

## Examples

### Counter

```tsx
import { useStorageState } from 'react-simplikit';

function Counter() {
  const [count, setCount] = useStorageState<number>('counter', {
    defaultValue: 0,
  });

  return <button onClick={() => setCount(prev => prev + 1)}>Count: {count}</button>;
}
```

### Search History

```tsx
import { useStorageState } from 'react-simplikit';

function SearchHistory() {
  const [recentSearches, setRecentSearches] = useStorageState<string[]>('recent-searches', {
    defaultValue: [],
  });
}
```
