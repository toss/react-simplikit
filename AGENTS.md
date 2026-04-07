# AGENTS.md

> Tool-agnostic project conventions for AI coding assistants.
> For Claude Code-specific instructions, see [CLAUDE.md](./CLAUDE.md).

## Project Overview

React utility hooks/components library. Monorepo with two packages:

- `react-simplikit` (`packages/core`) — Platform-independent React hooks & components
- `@react-simplikit/mobile` (`packages/mobile`) — Mobile web utilities (viewport, keyboard, layout)

## Architecture

Layer dependency is **unidirectional** — no upward or circular imports:

```
components → hooks → utils → _internal
```

- Components may use hooks, utils, \_internal
- Hooks may use utils, \_internal
- Utils may use \_internal only
- Core and mobile are independent packages — no cross-package dependencies

## File Structure

Each hook/component/util lives in its own folder with co-located docs:

```
src/hooks/useHookName/
├── index.ts               # Re-export
├── useHookName.ts         # Implementation
├── useHookName.spec.ts    # Tests (core) / useHookName.test.ts (mobile)
├── useHookName.ssr.test.ts # SSR safety tests
├── useHookName.md         # English docs
└── ko/
    └── useHookName.md     # Korean docs
```

## Coding Standards

- **`type` over `interface`** — Always use `type` for type aliases
- **Named functions in useEffect** — `useEffect(function handleResize() { ... }, [])` not arrow functions
- **No implicit boolean coercion** — `if (value)` → `if (value != null)` (enforced by `strict-boolean-expressions`)
- **Import extensions** — Use `.ts`/`.tsx` extensions in source imports (tsup converts to `.js` for ESM output)
- **Named exports only** — No default exports
- **No `any` types** — Full TypeScript strict mode
- **Zero runtime dependencies**

### Nullish Checks and Control Flow

**Use `== null` for nullish checks** — checks both null and undefined:

```ts
// ✅ Good
if (ref == null) {
  continue;
}
items.filter(item => item != null);

// ✅ Use !== undefined only when null/undefined distinction matters
const controlled = valueProp !== undefined;
```

**Prefer early returns (guard clauses)** over nested if-else:

```ts
// ✅ Good — guard clause
function process(value: string | null) {
  if (value == null) {
    return DEFAULT;
  }
  return transform(value);
}

// ❌ Bad — nested if-else
function process(value: string | null) {
  if (value != null) {
    return transform(value);
  } else {
    return DEFAULT;
  }
}
```

**Function declarations use `function` keyword**, arrow functions only for short inline callbacks:

```ts
// ✅ Good — function keyword for declarations
function toggle(state: boolean) {
  return !state;
}

// ✅ Good — arrow for inline callbacks
items.filter(item => item != null);

// ❌ Bad — arrow for function declarations
const toggle = (state: boolean) => !state;
```

### SSR-Safe Pattern

All hooks/utils accessing browser APIs must be SSR-safe:

```ts
const [state, setState] = useState(FIXED_INITIAL_VALUE);
useEffect(function syncBrowserState() {
  if (isServer()) return;
  setState(getBrowserAPI());
}, []);
```

Never initialize state with browser API calls (causes hydration mismatch).

### Hook Return Value Convention

- **Single value**: `useDebounce<T>(value, delay): T`
- **Tuple** (2 items): `useToggle(init): [boolean, () => void]`
- **Object** (3+ items): `usePagination(): { page, nextPage, prevPage }`

## Testing

- **100% coverage mandatory** — Enforced by Vitest coverage threshold
- **SSR tests required** — All hooks accessing browser APIs need `.ssr.test.ts`
- **useEffect cleanup** — Always return cleanup in useEffect to remove listeners
- **SSR test pattern**:
  ```ts
  import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';
  it('is safe on server side rendering', () => {
    const result = renderHookSSR.serverOnly(() => useHookName());
    expect(result.current).toBeDefined();
  });
  ```

### Performance Patterns

- Throttle subscriptions at ~16ms (60fps)
- Deduplicate to skip unchanged updates
- Use `startTransition` for non-urgent state updates (React 18+)

## Documentation

- **Bilingual**: English + Korean (co-located in hook folders)
- **JSDoc required**: Every public API must have `@description` + `@example` + `@param` + `@returns`

## Commit Convention

Format: `<type>(<scope>): <description>`

Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`
Scope: `core`, `mobile`, or area name

## Commands

```bash
yarn build          # Build all packages (tsup)
yarn test           # Run tests (Vitest)
yarn fix            # Auto-fix lint + format
yarn typecheck      # Type check (tsc --noEmit)
```
