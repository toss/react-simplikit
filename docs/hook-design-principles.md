# React Hook Design Principles

> Status: Draft (pending discussion)
> Korean version: [ko/hook-design-principles.md](./ko/hook-design-principles.md)

---

## 1. Requirements

### Background

Hook design philosophy accumulated from operating react-simplikit is defined as **a single set of shared principles**. These principles serve two purposes:

1. **Code review** — `react-hook-review` skill provides feedback based on these principles
2. **Code writing** — `react-hook-writing` skill provides guidance based on these principles

### Two Directions of Principles

| Direction                         | Source                                | Scope                                                       |
| --------------------------------- | ------------------------------------- | ----------------------------------------------------------- |
| **Coding Principles** (Section 2) | CLAUDE.md, AGENTS.md, internal skills | Return values, TypeScript, performance, documentation       |
| **Usage Patterns** (Section 3)    | React official docs (react.dev)       | State design, effect usage, memoization, custom hook design |

### Core Requirements

| #   | Requirement                          | Detail                                                                 |
| --- | ------------------------------------ | ---------------------------------------------------------------------- |
| R1  | Shared principles for review/writing | Both skills reference the same principles                              |
| R2  | Why-first                            | Not just rules (What), but philosophy (Why) with narrative explanation |
| R3  | Opinionated transparency             | Clearly mark 🟢 Best Practice vs 🟡 Opinionated                        |
| R4  | Project-agnostic                     | No react-simplikit paths/commands/utils — universal principles only    |
| R5  | Cross-tool                           | Claude Code plugin + Codex (AGENTS.md) + Cursor (.cursorrules)         |

### Open Questions

| #   | Question                                                       | Options                                           |
| --- | -------------------------------------------------------------- | ------------------------------------------------- |
| Q1  | Include C14 (Named useEffect)?                                 | A) Include as "Recommended" B) Exclude            |
| Q2  | Recommend C2 (SSR-Safe) for non-SSR projects?                  | A) Always B) SSR projects only                    |
| Q3  | Require @example in C9 (JSDoc)?                                | A) All 4 tags required B) @example is recommended |
| Q4  | Any additional principles?                                     | —                                                 |
| Q5  | Finalize principles first, or go straight to plugin structure? | A) Principles first B) Plugin directly            |
| Q6  | Plugin distribution channel                                    | A) git-subdir B) npm C) TBD                       |

---

## 2. Hook Coding Principles (Direction 1)

Coding style principles extracted from CLAUDE.md + AGENTS.md + internal skills.

### 🟢 Best Practice (11) + 🟡 Opinionated (3: C1, C7, C14)

> C1 and C7 are marked 🟡 inline because they are project conventions rather than React-wide best practices. C14 is listed in its own 🟡 section below.

#### C1. Always Return Objects 🟡

Return objects even for single values — `{ value }` form. Objects are order-independent, self-documenting via named fields, and extensible without breaking changes.

> Note: This is a **project convention**. React docs say "Hooks may return arbitrary values." React's own `useState` returns a tuple. We chose objects for extensibility.
> 📖 [react.dev — Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

```ts
function useDebounce<T>(value: T, delay: number): { value: T };
function useToggle(init: boolean): { value: boolean; toggle: () => void };
function usePagination(): { page: number; next: () => void; prev: () => void };
```

#### C2. SSR-Safe Initialization

`useState(FIXED_VALUE)` + `useEffect(sync)`. Never initialize state with browser APIs. Server has no `window` — crashes or hydration mismatch.

> 📖 [react.dev — hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot)

```ts
// ✅ SSR safe
const [width, setWidth] = useState(0);
useEffect(function syncWidth() {
  setWidth(window.innerWidth);
}, []);

// ❌ SSR crash
const [width, setWidth] = useState(window.innerWidth);

// ⚠️ Acceptable in client-only apps
const [width, setWidth] = useState(() => {
  if (typeof window === 'undefined') return 0;
  return window.innerWidth;
});
```

#### C3. useEffect Cleanup When Subscribing

Return cleanup when your effect sets up subscriptions, listeners, timers, or ongoing connections. React docs: cleanup is _optional_, not required for every effect — but mandatory when synchronizing with external systems.

> 📖 [react.dev — useEffect](https://react.dev/reference/react/useEffect) > _"Your setup function may also optionally return a cleanup function."_

```ts
// Event listeners
useEffect(function subscribe() {
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);

// AbortController (async)
useEffect(
  function fetchData() {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal }).then(/* ... */);
    return () => controller.abort();
  },
  [url]
);

// Timers
useEffect(function tick() {
  const id = setInterval(callback, 1000);
  return () => clearInterval(id);
}, []);
```

#### C4. No `any` Types

Use generics `<T>`. `any` propagates and defeats the type system. Justified `eslint-disable` with comment is acceptable for generic callback types.

```ts
// ✅ Generic
function useDebounce<T>(value: T, delay: number): T;

// ✅ Justified exception (comment required)
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic callback
type AnyFunction = (...args: any[]) => unknown;
```

#### C5. Named Exports Only

Guarantees tree-shaking + unambiguous imports. No `export default`.

#### C6. Strict Boolean & Nullish Checks

No implicit `if (value)` — prevents silent bugs with `0`, `""`, `false`. Use `== null` for nullish checks (both null and undefined).

```ts
if (ref == null) { return; }              // ✅ null + undefined
const controlled = valueProp !== undefined; // ✅ when distinction needed
if (count) { ... }                         // ❌ fails when count = 0
```

#### C7. Object Parameters 🟡

Hook params as object props, not positional args. Order-independent, self-documenting, extensible without breaking changes.

> Note: This is a **project convention**. React's own hooks use positional args (`useState(initialValue)`). We chose objects for extensibility and self-documentation.

```ts
// ✅ Object params
function useDebounce<T>({
  value,
  delay,
  leading,
}: {
  value: T;
  delay: number;
  leading?: boolean;
}): { value: T };

// ❌ Positional params
function useDebounce<T>(
  value: T,
  delay: number,
  leading?: boolean
): { value: T };
```

#### C8. Guard Clauses (Early Return)

Early return over nested if-else. Filter failure conditions first, keep success logic flat.

```ts
// ✅
function process(value: string | null) {
  if (value == null) {
    return DEFAULT;
  }
  return transform(value);
}

// ❌
function process(value: string | null) {
  if (value != null) {
    return transform(value);
  } else {
    return DEFAULT;
  }
}
```

#### C9. JSDoc 4-Tag

All public APIs must have `@description` + `@param` + `@returns` + `@example`. Enables AI doc generation + IDE tooltips.

```ts
/**
 * @description Delays value updates until after a specified period of inactivity.
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds
 * @returns The debounced value
 * @example
 * const debouncedQuery = useDebounce(query, 300);
 */
```

#### C10. Performance Patterns

Apply only to high-frequency events (30+/sec). Not needed for general hooks.

| Technique       | When to Apply                               |
| --------------- | ------------------------------------------- |
| Throttle (16ms) | scroll, resize, pointer, keyboard           |
| Deduplicate     | Skip setState when value unchanged          |
| startTransition | Non-urgent derived computations (React 18+) |

#### C11. Function Keyword for Declarations

Use `function` keyword for declarations. Arrows only for inline callbacks (map, filter).

```ts
function toggle(state: boolean) {
  return !state;
} // ✅ declaration
items.filter(item => item != null); // ✅ inline
const toggle = (state: boolean) => !state; // ❌ arrow for declaration
```

#### C12. Zero Runtime Dependencies

No external runtime dependencies in production code. Only `peerDependencies` allowed. Minimizes bundle size + prevents dependency conflicts.

#### C13. Avoid Direct External Dependencies

Inject external dependencies as parameters rather than importing directly inside hooks. Improves testability + replaceability.

```ts
// ✅ Dependency injection
function useFetch<T>(fetcher: (url: string) => Promise<T>, url: string) { ... }

// ❌ Direct import
function useFetch<T>(url: string) { const res = await axios.get(url); ... }
```

### 🟡 Opinionated (C14)

#### C14. Named useEffect Functions

`useEffect(function handleResize() {...})`. Shows "handleResize" instead of "anonymous" in error stacks. Trade-off: more verbose than arrows. Named cleanup is "Recommended" (not required).

### Excluded (Project-Specific Decisions)

| Item                                | Reason                     |
| ----------------------------------- | -------------------------- |
| Import extensions (.js/.ts)         | Build-tool dependent       |
| 100% test coverage                  | Project policy             |
| File structure / commit conventions | Not hook design philosophy |

---

## 3. Hook Usage Patterns (Direction 2)

> Separate document: [react-hook-usage-patterns.md](./react-hook-usage-patterns.md)

16 patterns based on React official docs (react.dev), with source URLs and quotes (U1-U17, U4 removed):

| Category     | Count            | Key Patterns                                                                     |
| ------------ | ---------------- | -------------------------------------------------------------------------------- |
| State Design | U1-U3, U5-U7 (6) | Derive don't sync, don't mirror props, useRef, discriminated unions, group state |
| Effect Usage | U8-U14           | Effects for sync only, no chains, key reset, async cleanup                       |
| Memoization  | U15-U16          | useMemo >= 1ms, useCallback + memo() only                                        |
| Hook Design  | U17              | No lifecycle wrappers, extract reusable stateful logic only                      |

---

## 4. Plugin Architecture

### Derivation Flow

```
This document (principles definition)
    ↓ compress
react-hook-review/SKILL.md (checklist)
react-hook-writing/SKILL.md (guide)
    ↓ further compress
AGENTS.md Part 1 (for Codex)
    ↓ reference
.cursorrules (for Cursor)
```

### Directory Structure

```
packages/plugin/  (planned)
├── .claude-plugin/plugin.json
├── .codex-plugin/plugin.json
├── principles/                      ← Shared principles single source
├── skills/
│   ├── react-hook-review/SKILL.md   ← C1-C14 + U1-U17 checklist
│   └── react-hook-writing/
│       ├── SKILL.md                 ← Themed guide
│       └── references/patterns.md   ← 3 hook implementations
└── README.md
```

### Cross-Tool Support

| Tool                   | File               | Current      | Planned                                          |
| ---------------------- | ------------------ | ------------ | ------------------------------------------------ |
| Claude Code (internal) | `.claude/skills/`  | ✅ 10 skills | Keep                                             |
| Claude Code (plugin)   | `packages/plugin/` | ❌           | Create via Phase 1-5                             |
| Codex                  | `AGENTS.md`        | ✅ 162 lines | Split into Part 1 (Universal) + Part 2 (Project) |
| Cursor                 | `.cursorrules`     | ✅ 28 lines  | Keep AGENTS.md reference                         |

### Extraction Rules

| Extracted (Philosophy)                     | Left Behind (Implementation)         |
| ------------------------------------------ | ------------------------------------ |
| "Always return objects"                    | `packages/core/src/hooks/` paths     |
| "Named useEffect improves stack traces"    | `yarn test`, `yarn fix` commands     |
| "SSR-safe: fixed initial + useEffect sync" | `renderHookSSR.serverOnly()` utility |
| "4 JSDoc tags for AI doc generation"       | `100%` coverage threshold            |

### Generalization Transforms

| Before (Project-Specific)    | After (Universal)               |
| ---------------------------- | ------------------------------- |
| `renderHookSSR.serverOnly()` | Vitest + `delete global.window` |
| `yarn test` / `yarn fix`     | "Run your test suite"           |
| `packages/core/` paths       | "your source directory"         |
| `react-simplikit` references | Removed                         |

---

## 5. Execution Roadmap

| Phase | Content                                   | Output                         |
| ----- | ----------------------------------------- | ------------------------------ |
| 1     | Directory + plugin.json + README          | `packages/plugin/` structure   |
| 2     | react-hook-review SKILL.md                | C1-C14 + U1-U17 checklist      |
| 3     | react-hook-writing SKILL.md + patterns.md | Themed guide + 3 hook examples |
| 4     | Generalization validation (grep)          | 0 project references           |
| 5     | Plugin validate + local test              | Working confirmation           |

### Validation Criteria

| Item                     | Pass Criteria                                          |
| ------------------------ | ------------------------------------------------------ |
| Plugin structure         | `claude plugin validate .` — 0 errors                  |
| Universality             | 0 project-specific references in another React project |
| Philosophy depth         | Every rule has narrative "Why"                         |
| Opinionated transparency | 🟡 items have trade-offs stated                        |

### Future Expansion

- Codex/Gemini support (via AGENTS.md Part 1)
- Component design philosophy
- Marketplace migration (when 3+ plugins)
