---
name: library-api-design
description: React library public API design principles. Use when designing hooks, components, or utility APIs.
allowed-tools: Read, Glob, Grep
---

# Library API Design Guide

## Core Principles

1. **Simplicity first** (Simple > Clever)
2. **Maintain consistency**
3. **Tree-shaking friendly**
4. **Maximize TypeScript inference**
5. **Ensure SSR safety**

## Core Patterns

### Hook Return Values

```typescript
// Single value
function useDebounce<T>(value: T, delay: number): T;

// Tuple (state + action)
function useToggle(init = false): [boolean, () => void];

// Object (3 or more fields)
function usePagination(): { page; nextPage; prevPage };
```

### Parameters

```typescript
// Required first, optional last
function useDebounce<T>(
  value: T,           // required
  delay: number,      // required
  options?: {...}     // optional
): T
```

### SSR Safety

```typescript
// ✅ SSR-safe
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });
}
```

### Export

```typescript
// ✅ Named exports only
export { useDebounce } from './useDebounce';

// ❌ Default export
export default useDebounce;
```

## References

- [details.md](references/details.md) - Component design, advanced patterns
