# CLAUDE.md

## Project Overview

React utility hooks/components library. Monorepo with two packages:

- `react-simplikit` (`packages/core`) — Platform-independent React hooks & components
- `@react-simplikit/mobile` (`packages/mobile`) — Mobile web utilities (viewport, keyboard, layout)

## Development Quick Start

```bash
yarn build          # Build all packages (tsup)
yarn test           # Run tests (Vitest)
yarn fix            # Auto-fix lint + format (ESLint + Prettier)
yarn typecheck      # Type check (tsc --noEmit) - alias: yarn run test:type
yarn changeset      # Create a changeset
yarn changeset status  # Check pending changesets
```

## Architecture Rules

Layer dependency is **unidirectional** — no upward or circular imports allowed:

```
components → hooks → utils → _internal
```

- Components may use hooks, utils, \_internal
- Hooks may use utils, \_internal
- Utils may use \_internal only
- \_internal has no internal dependencies
- Mobile may depend on core; core must NOT depend on mobile

## File Structure Convention

Each hook/component/util lives in its own folder with co-located docs:

```
src/
├── hooks/
│   └── useHookName/
│       ├── index.ts               # Re-export
│       ├── useHookName.ts         # Implementation
│       ├── useHookName.spec.ts    # Tests (core)
│       ├── useHookName.test.ts    # Tests (mobile)
│       ├── useHookName.ssr.test.ts # SSR safety tests
│       ├── useHookName.md         # English docs
│       └── ko/
│           └── useHookName.md     # Korean docs
├── utils/
│   └── utilName/
│       ├── index.ts
│       ├── utilName.ts
│       └── utilName.test.ts
└── index.ts                       # Public API exports (alphabetically sorted)
```

## Coding Standards

- **`type` over `interface`** — Always use `type` for type aliases
- **Named functions in useEffect** — Improves stack traces and readability
  ```ts
  useEffect(function handleResize() { ... }, []);  // ✅
  useEffect(() => { ... }, []);                     // ❌
  ```
- **Strict boolean checks** — Use explicit comparisons (`value !== undefined`, not `if (value)`)
- **Import extensions** — Include `.js` in relative imports for ESM compliance
- **useEffect cleanup** — Always return cleanup to remove listeners/subscriptions
- **`"use client"` banner** — tsup adds this for RSC compatibility
- **Named exports only** — No default exports
- **No `any` types** — Full TypeScript strict mode, no escape hatches
- **Zero dependencies** — No runtime dependencies in production code

### SSR-Safe Coding Pattern

All hooks/utils accessing browser APIs must be SSR-safe:

```ts
// Pattern: Fixed initial value + useEffect sync
const [state, setState] = useState(FIXED_INITIAL_VALUE);
useEffect(function syncBrowserState() {
  if (isServer()) return;
  setState(getBrowserAPI());
}, []);
```

Never initialize state with browser API calls (causes hydration mismatch).

### Hook Return Value Convention

- **Single value**: `useDebounce<T>(value, delay): T`
- **Tuple** (state + action, 2 items): `useToggle(init): [boolean, () => void]`
- **Object** (3+ items): `usePagination(): { page, nextPage, prevPage }`

### Performance Patterns

- **Throttle** subscriptions at ~16ms (60fps) for viewport/keyboard events
- **Deduplicate** to skip updates when value hasn't changed
- **`startTransition`** for non-urgent state updates (React 18+)

## Testing

- **100% coverage mandatory** — Enforced by Vitest coverage threshold, no exceptions
- **SSR tests required** — All hooks accessing browser APIs must have `.ssr.test.ts`
- **Core tests**: `.spec.ts` (legacy, will migrate to `.test.ts`)
- **Mobile tests**: `.test.ts`
- **SSR pattern**:
  ```ts
  import { renderHookSSR } from '../utils/renderHookSSR';
  it('is safe on server side rendering', () => {
    const result = renderHookSSR.serverOnly(() => useHookName());
    expect(result.current).toBeDefined();
  });
  ```

## Documentation

- **Bilingual**: English + Korean (co-located in hook folders as `*.md` / `ko/*.md`)
- **JSDoc required**: Every public API must have `@description` + `@example` + `@param` + `@returns`
- **VitePress**: Used for documentation site; rewrites map source docs to clean URLs
- **Co-location**: Docs live inside package source, not in separate docs/ tree
- **Homepage**: `https://react-simplikit.slash.page`

## Commit Convention

Format: `<type>(<scope>): <description>`

- **Types**: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`
- **Scope**: Package name (`core`, `mobile`) or area
- Examples: `feat(mobile): add useKeyboardHeight hook`, `fix: correct SSR rendering logic`

## PR Checklist

- [ ] Tests pass (`yarn test`)
- [ ] Lint/format pass (`yarn fix`)
- [ ] 100% coverage maintained
- [ ] JSDoc with `@description` + `@example`
- [ ] Changeset added (if user-facing change)

## Release Flow

Uses **Changesets** + **GitHub Actions OIDC** for automated releases.

```
PR with changeset merged → release.yml triggers
  → changesets/action detects changeset → creates "Version PR"
  → Version PR merged → changesets/action: hasChangesets=false
  → "Publish to npm" step → changeset publish (uses npm publish internally)
```

### Critical: publishConfig does NOT work with npm

**npm does NOT support `publishConfig` overrides for manifest fields** (`main`, `types`, `module`, `exports`). Only `access`, `registry`, `tag` are supported. See [npm/cli#7586](https://github.com/npm/cli/issues/7586).

- `yarn npm publish` DOES support publishConfig field overrides
- `changeset publish` internally calls `npm publish` (not yarn)
- Therefore: **always declare `main`/`types`/`module`/`exports` at the top level** of package.json
- `publishConfig` should only contain `access: "public"`

### OIDC Trusted Publishing

- npm auth uses GitHub Actions OIDC (no secret tokens needed)
- Requires `id-token: write` permission in workflow
- Node 22 ships npm v10 which doesn't support OIDC → `npm install -g npm@latest` upgrades to npm 11+
- `changesets/action` must NOT have `publish` option (it overwrites `.npmrc` and breaks OIDC)
- Publish is done in a separate step after changesets/action

### Snapshot/Canary Releases

```bash
GITHUB_TOKEN=$(gh auth token) yarn changeset version --snapshot canary
yarn changeset publish --tag canary  # Requires npm login + OTP
```

## Package Structure

```
packages/
├── core/          # react-simplikit
│   ├── src/       # Source (hooks, components, utils)
│   ├── dist/      # CJS build output
│   ├── esm/       # ESM build output
│   └── package.json
└── mobile/        # @react-simplikit/mobile
    ├── src/
    ├── dist/      # CJS + ESM build output
    └── package.json
```

## package.json Convention

```jsonc
{
  "main": "./dist/index.cjs", // CJS entry (top level, NOT in publishConfig)
  "module": "./esm/index.js", // ESM entry for bundlers
  "types": "./dist/index.d.cts", // TypeScript types
  "exports": {
    // Modern Node.js/bundler resolution
    ".": {
      "import": { "types": "...", "default": "..." },
      "require": { "types": "...", "default": "..." },
    },
  },
  "publishConfig": {
    "access": "public", // ONLY access here, nothing else
  },
}
```
