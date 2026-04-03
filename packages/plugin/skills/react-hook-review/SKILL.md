---
description: Review React hooks against design philosophy. Checks return values, SSR safety, state design, effect usage, TypeScript patterns, and performance.
---

# React Hook Review

Review hooks against coding principles and usage patterns. Report findings by severity.

## Coding Principles Checklist

### Required (13 items)

1. **Return values (C1)** — Always return objects, even for single values. `{ value }` not bare primitives.
   Why: Named fields, order-independent, extensible without breaking changes.

2. **SSR-safe init (C2)** — `useState(FIXED)` + `useEffect(sync)`. No browser API in initializer.
   Why: Server has no `window` — crashes or hydration mismatch.

3. **Cleanup (C3)** — Every useEffect with side effects returns cleanup (listeners, timers, AbortController).
   Why: Memory leaks. StrictMode double-mount exposes missing cleanup immediately.

4. **No `any` (C4)** — Use generics `<T>`. Justified `eslint-disable` with comment is acceptable.
   Why: `any` propagates and defeats the type system.

5. **Named exports (C5)** — No default exports. Tree-shaking + unambiguous imports.

6. **Strict booleans (C6)** — `== null` for nullish, `!== undefined` for distinction. No implicit `if (value)`.
   Why: `0`, `""`, `false` are falsy — silent bugs.

7. **Object parameters (C7)** — Hook params as object props, not positional args.
   Why: Order-independent, self-documenting, extensible.

8. **Guard clauses (C8)** — Early return over nested if-else. Flat success path.

9. **JSDoc 4-tag (C9)** — @description + @param + @returns + @example on every public API.
   Why: AI doc generation quality + IDE tooltips.

10. **Performance (C10)** — Throttle (16ms) for >30 events/sec, deduplicate unchanged, startTransition for non-urgent.
    Only applies to high-frequency event hooks.

11. **Function keyword (C11)** — `function` for declarations, arrows for inline callbacks only.

12. **Zero deps (C12)** — No runtime dependencies. peerDependencies only.

13. **Dependency isolation (C13)** — Inject external dependencies as params, don't import directly in hooks.
    Why: Testability + replaceability.

### Recommended (1 item)

14. **Named useEffect (C14)** — `useEffect(function handleX() {...})` not arrows.
    Why: "handleResize" vs "anonymous" in error stacks. Trade-off: more verbose.

## Usage Patterns Checklist

### State Design

- **Derive, don't sync (U1)** — Compute from props/state during render. No `useEffect` for derived values.
- **Don't mirror props (U2)** — Use prop directly or name it `initialX`.
- **useRef for non-rendered (U3)** — Interval IDs, flags, previous values.
- **useReducer for complex (U4)** — 3+ related states changing together.
- **Discriminated unions (U5)** — Replace boolean combos with status union type.
- **IDs not objects (U6)** — Store selected ID, derive object from list.
- **Group related state (U7)** — Always-together values in one object.

### Effect Usage

- **Effects for sync only (U8)** — External systems. Not event handling or data transforms.
- **No effect chains (U9)** — Consolidate cascading setState into handlers/reducers.
- **Key reset (U10)** — `key={id}` to remount, not useEffect to clear state.
- **Deps inside effect (U11)** — Objects/functions used only in effect go inside it.
- **useSyncExternalStore (U12)** — For browser API / external store subscriptions.
- **Parent notify in handler (U13)** — Call parent callback in same event handler, not effect.
- **Async cleanup (U14)** — `ignore` flag or AbortController for every async effect.

### Memoization

- **useMemo >= 1ms (U15)** — Measure with console.time. Skip if < 1ms.
- **useCallback + memo() (U16)** — Only when child is wrapped in memo(). Otherwise pointless.

### Hook Design

- **Extract logic, not lifecycle (U17)** — No `useMount`. Purpose-specific hooks only.

## Output Format

### Great Work
- [What was done well]

### Required Changes
1. **[C#/U#]** Issue description
   - Current: `code`
   - Suggested: `code`
   - Why: [reason]

### Suggestions
- [Non-blocking improvements]

### Next Steps
1. Fix required changes
2. Run test suite
3. Commit
