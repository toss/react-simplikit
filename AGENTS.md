# AGENTS.md

> Tool-agnostic project conventions for AI coding assistants.
> For Claude Code-specific instructions, see [CLAUDE.md](./CLAUDE.md).

## Project Overview

React utility hooks/components library. Two published packages and an agent plugin:

- `react-simplikit` (`packages/react-simplikit`) — React hooks, components and utils. Mobile web hooks and utils (viewport, keyboard, safe area) live under `src/mobile` and are part of the same public API
- `react-simplikit-codemod` (`packages/codemod`) — bin-only CLI that runs upgrade codemods on consumer codebases (`mobile-to-root` today)
- `packages/plugin` — agent skills for Claude Code, Codex and skills.sh. No `package.json`, so it is neither a workspace nor on npm. `yarn skill:gen` regenerates `skills/react-simplikit` from the public exports and `yarn test:skill` fails CI when the committed copy drifts; `skills/react-simplikit-codemod` is hand-written

## Architecture

Layer dependency is **unidirectional** — no upward or circular imports:

```
components → hooks → utils → _internal
```

- Components may use hooks, utils, \_internal
- Hooks may use utils, \_internal
- Utils may use \_internal only
- Nothing outside `src/mobile` imports from it; `src/mobile` may use `src/utils` and `_internal` (test infrastructure is exempt)

## File Structure

Each hook/component/util lives in its own folder with co-located docs:

```
src/hooks/useHookName/
├── index.ts               # Re-export
├── useHookName.ts         # Implementation
├── useHookName.test.ts    # Tests (`.spec.ts` in older folders)
├── useHookName.ssr.test.ts # SSR safety tests
├── useHookName.md         # English docs
└── ko/
    └── useHookName.md     # Korean docs
```

## Coding Standards

- **`type` over `interface`** — Always use `type` for type aliases
- **Named functions in useEffect** — `useEffect(function handleResize() { ... }, [])` not arrow functions
- **No implicit boolean coercion** — `if (value)` → `if (value != null)` (enforced by `strict-boolean-expressions`)
- **Import extensions** — Use `.ts`/`.tsx` extensions in source imports (tsdown rewrites them to `.mjs`/`.cjs` in the output)
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
- **Object** also when the shape is expected to grow: `useKeyboardHeight(): { keyboardHeight }`

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

- **Locales**: English source plus the locales registered in `.vitepress/locales.mts` (currently ko, ja, zh-Hans, es), co-located with the source (`useX.md`, `<locale>/useX.md`; guides under `docs/<locale>/`)
- **JSDoc required**: Every public API must have `@description` + `@example` + `@param` + `@returns`
- **English API docs are generated**: `yarn docs:gen <name>` turns the JSDoc into `<name>.md`. Do not hand-edit the English API `.md`
- **Translations are written with your local AI harness**: draft from the English source, then review with `.claude/agents/agent-translation-reviewer.md` (glossary and rules inside). Nothing in CI translates
- **Keep translations in sync**: a PR that changes an English doc updates every translated counterpart. Untranslated pages fall back to English with a banner

## Commit Convention

Format: `<type>(<scope>): <description>`

Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`
Scope: the hook, component, util or area the change touches (`useToggle`, `docs`, `codemod`, `ci`); omit when it spans the package

## Commands

```bash
yarn build          # Build all packages (tsdown)
yarn test           # Run tests (Vitest)
yarn fix            # Auto-fix lint + format
yarn typecheck      # Type check (tsc --noEmit)
```
