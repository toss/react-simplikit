# useStorageState

`useStorageState` is a Hook that makes it convenient for React to handle persistent state in the browser's storage.

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

- `key`: Key for storage
- `options`:
  - `storage`: Storage to use (default: `safeLocalStorage`)
  - `defaultValue`: Initial value

## Returns

Returns a tuple of the form [state, setState]:

- `state`: Current state value
- `setState`: Function to update the state

## Notes

- Values must be JSON serializable
- Automatically syncs between tabs when using LocalStorage
- Returns default value when invalid JSON data is encountered
- Uses caching to minimize parsing operations
- Handles storage events for cross-tab communication

## Examples

### Counter

```tsx
import { useStorageState } from 'reactive-kit';

function Counter() {
  const [count, setCount] = useStorageState<number>('counter', {
    defaultValue: 0,
  });

  return <button onClick={() => setCount(prev => prev + 1)}>Count: {count}</button>;
}
```

### Search History

```tsx
import { useStorageState } from 'reactive-kit';

function SearchHistory() {
  const [recentSearches, setRecentSearches] = useStorageState<string[]>('recent-searches', {
    defaultValue: [],
  });
}
```
