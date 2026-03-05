# JSDoc Detailed Guide

## @param Advanced Patterns

### Optional Parameters

```typescript
@param {boolean} [enabled=true] - Whether enabled.
```

### Object properties

```typescript
@param {Object} options - Configuration.
@param {number} [options.delay] - Delay in ms.
@param {boolean} [options.leading] - Execute on leading edge.
```

### Generic Types

```typescript
@template T - The type of the value.
@param {T} value - The value to process.
```

## @returns Advanced Patterns

### Tuple Return

```typescript
@returns {[boolean, () => void]} A tuple containing:
- value (boolean) - Current state.
- toggle (() => void) - Toggle function.
```

### Object Return

```typescript
@returns {Object} Pagination state:
- page (number) - Current page.
- nextPage (() => void) - Go to next.
- prevPage (() => void) - Go to previous.
```

## Complete Example

```typescript
/**
 * @description Debounces a value and returns it after the specified delay.
 *
 * Useful when you want to delay updates to a frequently changing value.
 *
 * @template T - The type of the value.
 *
 * @param {T} value - The value to debounce.
 * @param {number} delay - The delay in milliseconds.
 *
 * @returns {T} The debounced value.
 *
 * @example
 * import { useDebounce } from 'react-simplikit';
 *
 * function Search() {
 *   const [search, setSearch] = useState('');
 *   const debouncedSearch = useDebounce(search, 300);
 *
 *   useEffect(() => {
 *     fetch(`/api/search?q=${debouncedSearch}`);
 *   }, [debouncedSearch]);
 *
 *   return <input value={search} onChange={e => setSearch(e.target.value)} />;
 * }
 */
export function useDebounce<T>(value: T, delay: number): T {
  // ...
}
```

## Common Mistakes

```typescript
// ❌ No description
@param {T} value
@returns {T}

// ❌ No example
@description Debounces a value.
@param {T} value - The value.

// ❌ Non-working example
@example
const x = useDebounce(); // Missing params!

// ✅ Complete
@description Debounces a value.
@param {T} value - The value to debounce.
@param {number} delay - Delay in ms.
@returns {T} The debounced value.
@example
const debounced = useDebounce(search, 300);
```
