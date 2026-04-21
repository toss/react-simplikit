# Hook Implementation Patterns

Three complete hooks demonstrating the design principles in practice.

---

## 1. useToggle (Simple)

Demonstrates: C1 (object return), C5 (named export), C7 (object params), C9 (JSDoc), C14 (named useEffect)

```ts
import { useState, useCallback } from 'react';

/**
 * @description Manages a boolean toggle state.
 * @param {{ initial?: boolean }} params - Hook parameters
 * @returns {{ value: boolean; toggle: () => void; setTrue: () => void; setFalse: () => void }}
 * @example
 * const { value: isOpen, toggle } = useToggle({ initial: false });
 * <button onClick={toggle}>{isOpen ? 'Close' : 'Open'}</button>
 */
export function useToggle({ initial = false }: { initial?: boolean } = {}) {
  const [value, setValue] = useState(initial);

  const toggle = useCallback(function toggle() {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback(function setTrue() {
    setValue(true);
  }, []);

  const setFalse = useCallback(function setFalse() {
    setValue(false);
  }, []);

  return { value, toggle, setTrue, setFalse };
}
```

### Anti-pattern comparison

```ts
// Bad: tuple return (C1 violation)
export function useToggle(initial = false): [boolean, () => void] {
  // Adding setTrue/setFalse later = breaking change for all consumers
}

// Bad: default export (C5 violation)
export default function useToggle() { ... }

// Bad: positional params (C7 violation)
export function useToggle(initial: boolean, onChange?: (v: boolean) => void) { ... }
```

---

## 2. useDebounce (Intermediate)

Demonstrates: C1 (object return), C3 (cleanup), C4 (generic), C7 (object params), C9 (JSDoc), C11 (function keyword)

```ts
import { useState, useEffect, useRef } from 'react';

/**
 * @description Delays updating a value until after a specified period of inactivity.
 * @param {{ value: T; delay: number }} params - The value to debounce and delay in ms
 * @returns {{ value: T }} The debounced value
 * @example
 * const { value: debouncedQuery } = useDebounce({ value: searchQuery, delay: 300 });
 * useEffect(function fetchResults() {
 *   fetch(`/api/search?q=${debouncedQuery}`);
 * }, [debouncedQuery]);
 */
export function useDebounce<T>({ value, delay }: { value: T; delay: number }): {
  value: T;
} {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    function scheduleUpdate() {
      const timer = setTimeout(function applyUpdate() {
        setDebouncedValue(value);
      }, delay);

      return function cancelPendingUpdate() {
        clearTimeout(timer);
      };
    },
    [value, delay]
  );

  return { value: debouncedValue };
}
```

### Anti-pattern comparison

```ts
// Bad: no cleanup (C3 violation) — timer leak on rapid value changes
useEffect(() => {
  setTimeout(() => setDebouncedValue(value), delay);
  // Missing: return () => clearTimeout(timer)
}, [value, delay]);

// Bad: any type (C4 violation)
function useDebounce(value: any, delay: any): any { ... }
```

---

## 3. useMediaQuery (Complex — SSR-Safe)

Demonstrates: C1 (object return), C2 (SSR-safe), C3 (cleanup), C10 (performance), C14 (named effect)
Also: U3 (useRef for non-rendered), U8 (effect for external sync)

```ts
import { useState, useEffect, useRef } from 'react';

/**
 * @description Tracks whether a CSS media query matches. SSR-safe with fixed initial value.
 * @param {{ query: string }} params - The media query string
 * @returns {{ matches: boolean }} Whether the media query currently matches
 * @example
 * const { matches: isMobile } = useMediaQuery({ query: '(max-width: 768px)' });
 * return isMobile ? <MobileLayout /> : <DesktopLayout />;
 */
export function useMediaQuery({ query }: { query: string }): {
  matches: boolean;
} {
  const [matches, setMatches] = useState(false); // C2: Fixed initial value (SSR-safe)
  const prevMatchesRef = useRef(false); // U3: Non-rendered value

  useEffect(
    function syncMediaQuery() {
      if (typeof window === 'undefined') {
        return;
      }

      const mediaQueryList = window.matchMedia(query);

      function handleChange() {
        const nextMatches = mediaQueryList.matches;

        // C10: Deduplicate — skip if unchanged
        if (prevMatchesRef.current === nextMatches) {
          return;
        }
        prevMatchesRef.current = nextMatches;
        setMatches(nextMatches);
      }

      // Initial sync
      handleChange();

      // Subscribe
      mediaQueryList.addEventListener('change', handleChange);

      return function cleanupMediaQuery() {
        mediaQueryList.removeEventListener('change', handleChange);
      };
    },
    [query]
  );

  return { matches };
}
```

### Anti-pattern comparison

```ts
// Bad: SSR crash (C2 violation)
const [matches] = useState(window.matchMedia(query).matches);

// Bad: no cleanup (C3 violation) — listener leak
useEffect(() => {
  const mql = window.matchMedia(query);
  mql.addEventListener('change', handler);
  // Missing: return () => mql.removeEventListener(...)
}, [query]);

// Bad: no dedup — unnecessary re-renders
function handleChange() {
  setMatches(mediaQueryList.matches); // fires even when value unchanged
}
```

---

## SSR-Safe Hook Template

Generic template for hooks that access browser APIs:

```ts
export function useExample({ param }: { param: ParamType }): {
  value: ReturnType;
} {
  const [value, setValue] = useState<ReturnType>(FIXED_INITIAL); // C2: SSR-safe
  const prevRef = useRef<ReturnType>(FIXED_INITIAL); // U3: non-rendered

  useEffect(
    function syncBrowserValue() {
      if (typeof window === 'undefined') {
        return;
      }

      // Initial sync
      const current = getBrowserValue(param);
      prevRef.current = current;
      setValue(current);

      // Subscribe to changes
      function handleChange() {
        const next = getBrowserValue(param);
        if (prevRef.current === next) {
          return;
        } // C10: dedup
        prevRef.current = next;
        setValue(next);
      }

      window.addEventListener('event', handleChange);

      return function cleanup() {
        window.removeEventListener('event', handleChange);
      };
    },
    [param]
  );

  return { value };
}
```

---

## Anti-Pattern Collection

| Anti-Pattern                                            | Principle Violated   | Fix                             |
| ------------------------------------------------------- | -------------------- | ------------------------------- |
| `useState(window.innerWidth)`                           | C2 (SSR)             | `useState(0)` + useEffect sync  |
| Missing cleanup on addEventListener                     | C3 (Cleanup)         | Return removeEventListener      |
| `function useData(url: any): any`                       | C4 (No any)          | Use generic `<T>`               |
| `export default useHook`                                | C5 (Named exports)   | `export function useHook`       |
| `if (count)` where count can be 0                       | C6 (Strict booleans) | `if (count != null)`            |
| `useEffect(() => { setFullName(...) }, [first, last])`  | U1 (Derive)          | `const fullName = first + last` |
| `const [color] = useState(colorProp)`                   | U2 (Mirror props)    | `const color = colorProp`       |
| `const [id, setId] = useState(null)` for non-rendered   | U3 (useRef)          | `useRef(null)`                  |
| chained useEffects setting state                        | U9 (No chains)       | Consolidate in handler          |
| `useMemo(() => items.filter(...), [items])` on 20 items | U15 (Measure first)  | Plain computation               |
