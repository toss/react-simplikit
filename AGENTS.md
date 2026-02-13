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
- Mobile may depend on core; core must NOT depend on mobile

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
- **Strict boolean checks** — `value !== undefined` not `if (value)`
- **Import extensions** — Use `.ts`/`.tsx` extensions in source imports (tsup converts to `.js` for ESM output)
- **Named exports only** — No default exports
- **No `any` types** — Full TypeScript strict mode
- **Zero runtime dependencies**

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
