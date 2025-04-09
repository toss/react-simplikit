# useDebounce

`useDebounce` is a React hook that delays function calls and groups multiple sequential calls into a single one.
It is useful for optimizing event handling, such as search input, button click prevention, and other high-frequency events.

## Interface

```ts
function useDebounce<F extends (...args: unknown[]) => unknown>(
  callback: F,
  wait: number,
  options?: {
    leading?: boolean;
    trailing?: boolean;
  }
): F & { cancel: () => void };
```

### Parameters

- `callback` (`F`): The function to debounce.
- `wait` (`number`): The number of milliseconds to delay.
- `options` (`object`): Options that control the debounce behavior.
  - `leading` (`boolean`): If `true`, the function is called at the start of the sequence. Defaults to `false`.
  - `trailing` (`boolean`): If `true`, the function is called at the end of the sequence. Defaults to `true`.

### Returns

Returns the debounced function that maintains the original function's type signature and includes an additional `cancel` method:

- `cancel` (`() => void`): A function that cancels any pending debounced execution.

## Examples

```tsx
import { useDebounce } from 'react-simplikit';

function SearchInput() {
  const [query, setQuery] = useState('');

  const debouncedSearch = useDebounce((value: string) => {
    // Actual API call
    searchAPI(value);
  }, 300);

  return (
    <input
      value={query}
      onChange={e => {
        setQuery(e.target.value);
        debouncedSearch(e.target.value);
      }}
      placeholder="Enter search term"
    />
  );
}
```
