---
name: react-hook-writing
description: Write React hooks following design philosophy. Covers naming, return values, SSR safety, state design, effect patterns, TypeScript, and performance.
---

# React Hook Writing Guide

Design principles for writing React hooks. Each section covers What + Why.

Treat C1 and C7 as project conventions rather than universal React rules. React itself allows tuple returns and positional arguments, but this philosophy prefers objects for extensibility and self-documenting APIs.

## 1. API Design

**Return values (C1):** Always return objects. Even single values use `{ value }`.
Why: Named fields, order-independent, extensible without breaking changes.

```ts
function useDebounce<T>({ value, delay }: { value: T; delay: number }): {
  value: T;
};
function useToggle({ initial }: { initial?: boolean }): {
  value: boolean;
  toggle: () => void;
};
```

**Parameters (C7):** Object props, not positional. Order-independent + self-documenting.

**Named exports (C5):** No default exports.

## 2. SSR Safety

**Fixed initial + useEffect sync (C2).** Never call browser APIs in useState initializer.

```ts
const [width, setWidth] = useState(0);
useEffect(function syncWidth() {
  setWidth(window.innerWidth);
}, []);
```

For client-only apps: conditional initializer `useState(() => { if (typeof window === 'undefined') return 0; ... })` is acceptable.

## 3. State Design

**Derive, don't sync (U1):** Compute from existing state during render. No useEffect for derived values.

```ts
// Compute during render
const fullName = firstName + ' ' + lastName;
```

**useRef for non-rendered values (U3):** Interval IDs, flags, previous values.

**Discriminated unions (U5):** Replace boolean combos with `type Status = 'idle' | 'loading' | 'done'`.

**Don't mirror props (U2):** Use directly, or name `initialX`.

**IDs not objects (U6), group related state (U7).**

**Guard clauses (C8):** Prefer early returns over nested conditionals so the happy path stays flat and the failure path is obvious.

## 4. Effect Patterns

**Effects for sync only (U8).** External systems (network, DOM, browser APIs). Not for event handling or data transforms.

**No effect chains (U9).** Consolidate cascading setState into event handlers or reducers.

**Key reset (U10):** `key={id}` to remount cleanly, not useEffect to clear state.

**Deps inside effect (U11):** Objects/functions used only in effect — define inside.

**Parent notify in handler (U13):** Call parent callback in same event handler, not effect.

**useSyncExternalStore (U12):** For browser API or third-party store subscriptions, prefer `useSyncExternalStore` over `useState` + `useEffect`. Prevents tearing in concurrent rendering and supports SSR server snapshots.

**Named useEffect functions (C14):** Optional but recommended for stack traces and debugging clarity.

## 5. Cleanup (C3)

Every side effect needs cleanup. Three patterns:

```ts
// Event listeners
return () => window.removeEventListener('resize', handler);

// Async (AbortController)
const controller = new AbortController();
return () => controller.abort();

// Timers
return () => clearInterval(id);
```

Async effects need ignore flags or AbortController to prevent race conditions (U14).

## 6. Performance (C10)

Apply only to >30 events/sec (scroll, resize, keyboard):

- **Throttle** at 16ms (60fps)
- **Deduplicate**: skip setState when value unchanged
- **startTransition**: expensive non-urgent computations

**useMemo (U15):** Only for measured >= 1ms computations.
**useCallback (U16):** Only when passing to memo()-wrapped children.

## 7. TypeScript

- **Generics `<T>` (C4):** No `any`. Justified eslint-disable with comment is acceptable.
- **`as const`** for tuple returns (if ever needed).
- **Strict booleans (C6):** `== null` for nullish, `!== undefined` for distinction.
- **Function keyword (C11):** For declarations. Arrows for inline callbacks.

## 8. Documentation (C9)

```ts
/**
 * @description [One-line summary]
 * @param {{ value: T; delay: number }} params - Hook parameters
 * @returns {{ value: T }} Debounced value
 * @example
 * const { value } = useDebounce({ value: query, delay: 300 });
 */
```

## 9. Dependencies

- **Zero runtime deps (C12):** peerDependencies only.
- **Inject externals (C13):** Pass fetcher/client as param, don't import directly.
- **Extract hooks for reuse (U17):** Same state+effect in 2+ components? Extract. No lifecycle wrappers.

## Reference

See [patterns.md](references/patterns.md) for 3 complete hook implementations.
Use `react-design-principles` when the question is about higher-level React API or abstraction design rather than a specific hook implementation.
