---
name: react-hook-review
description: Review React hooks against design philosophy. Checks return values, SSR safety, state design, effect usage, TypeScript patterns, and performance.
---

# React Hook Review

Review hooks against coding principles and usage patterns. Report findings by severity.

Treat C1, C7, and C14 as opinionated conventions unless the target codebase explicitly adopts them. Report them as stronger findings when the repository standard is clear; otherwise phrase them as consistency recommendations.

## Coding Principles Checklist

### Required (11 items)

1. **Return values (C1)** — Always return objects, even for single values. `{ value }` not bare primitives.
   Why: Named fields, order-independent, extensible without breaking changes.

2. **SSR-safe init (C2)** — `useState(FIXED)` + `useEffect(sync)`. No browser API in initializer.
   Why: Server has no `window` — crashes or hydration mismatch.
   Note: For explicitly client-only hooks, a guarded lazy initializer can be acceptable.

3. **Cleanup (C3)** — Every useEffect with side effects returns cleanup (listeners, timers, AbortController).
   Why: Memory leaks. StrictMode double-mount exposes missing cleanup immediately.

4. **No `any` (C4)** — Use generics `<T>`. Justified `eslint-disable` with comment is acceptable.
   Why: `any` propagates and defeats the type system.

5. **Named exports (C5)** — No default exports. Tree-shaking + unambiguous imports.

6. **Strict booleans (C6)** — `== null` for nullish, `!== undefined` for distinction. No implicit `if (value)`.
   Why: `0`, `""`, `false` are falsy — silent bugs.

7. **Object parameters (C7)** — Hook params as object props, not positional args.
   Why: Order-independent, self-documenting, extensible.

8. **JSDoc 4-tag (C9)** — @description + @param + @returns + @example on every public API.
   Why: AI doc generation quality + IDE tooltips.

9. **Performance (C10)** — Throttle (16ms) for >30 events/sec, deduplicate unchanged, startTransition for non-urgent.
   Only applies to high-frequency event hooks.

10. **Zero deps (C12)** — No runtime dependencies. peerDependencies only.

11. **Dependency isolation (C13)** — Inject external dependencies as parameters rather than importing them directly inside hooks.
    Why: Testability + replaceability.

### Recommended (3 items)

12. **Guard clauses (C8)** — Early return over nested if-else. Flat success path.
    Trade-off: Stylistic preference with no functional impact.

13. **Function keyword (C11)** — `function` for declarations, arrows for inline callbacks only.
    Trade-off: Consistent style, but arrow declarations are valid JS.

14. **Named useEffect (C14)** — `useEffect(function handleX() {...})` not arrows.
    Why: "handleResize" vs "anonymous" in error stacks. Trade-off: more verbose.

## Usage Patterns Checklist

### State Design

- **Derive, don't sync (U1)** — Compute from props/state during render. No `useEffect` for derived values.
- **Don't mirror props (U2)** — Use prop directly or name it `initialX`.
- **useRef for non-rendered (U3)** — Interval IDs, flags, previous values.
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

## Review Heuristics

- Flag React guidance from U1-U17 as behavior or maintainability issues first.
- Flag C1 and C7 as API consistency issues unless the repo treats them as hard requirements.
- Lower the severity of C14 unless debugging quality is materially affected.
- When a hook mirrors props, chains effects, or hides lifecycle wrappers, explain the runtime consequence, not just the rule number.

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
