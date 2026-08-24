# CLAUDE.md

## Project Overview

React utility hooks/components library. Single package monorepo:

- `react-simplikit` (`packages/react-simplikit`) — Platform-independent React hooks & components at the root export, plus mobile web utilities (viewport, keyboard, layout) under the `react-simplikit/mobile` subpath (`src/mobile`)

## Development Quick Start

```bash
yarn build          # Build all packages (tsdown)
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
- **Import extensions** — Use `.ts`/`.tsx` extensions in source imports (tsdown rewrites them to `.mjs`/`.cjs` in the output)
- **useEffect cleanup** — Always return cleanup to remove listeners/subscriptions
- **`"use client"` banner** — tsdown adds this to every emitted file for RSC compatibility
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
  → Version PR merged → changesets/action: has-changesets=false
  → action runs `publish-script` (changeset publish → `yarn npm publish`), pushes tags, creates GitHub Releases
```

### Changesets v3 + Yarn PnP

- `changesets/action` v2 requires `@changesets/cli` v3 — bump both majors together.
- `.changeset/config.json` points `changelog` at the shim `.changeset/changelog.mjs`, not `@changesets/changelog-github` directly — the bare package name does not resolve under PnP (see the shim). Do not "simplify" it back.

### Critical: publishConfig does NOT work with npm

**npm does NOT support `publishConfig` overrides for manifest fields** (`main`, `types`, `module`, `exports`). Only `access`, `registry`, `tag` are supported. See [npm/cli#7586](https://github.com/npm/cli/issues/7586).

- `yarn npm publish` DOES support publishConfig field overrides
- `changeset publish` v3 calls `yarn npm publish` for Yarn Berry, but manifests must stay valid for plain `npm pack` (`verify-pack`)
- Therefore: **always declare `main`/`types`/`module`/`exports` at the top level** of package.json
- `publishConfig` should only contain `access: "public"`

### OIDC Trusted Publishing

- npm auth uses GitHub Actions OIDC (no secret tokens needed)
- Requires `id-token: write` permission in workflow
- The OIDC exchange is done by Yarn (`yarn npm publish`; the pinned `yarnPath` 4.18 supports it), not by the npm CLI
- Do NOT reinstate `npm install -g npm@latest` — it is unpinned, and it broke the release job once npm 12 raised its Node floor above `.nvmrc`
- Publish runs via the action's `publish-script`; it must keep invoking the Changesets CLI (it reads `CHANGESETS_OUTPUT` to know what to tag/release)
- Provenance: `YARN_NPM_PUBLISH_PROVENANCE: true` — `NPM_CONFIG_PROVENANCE` is ignored by Yarn

### Snapshot/Canary Releases

```bash
GITHUB_TOKEN=$(gh auth token) yarn changeset version --snapshot canary
yarn changeset publish --tag canary  # Requires npm login + OTP
```

## Package Structure

```
packages/
└── react-simplikit/   # react-simplikit
    ├── src/           # Source (hooks, components, utils)
    │   └── mobile/    # Mobile web utilities (react-simplikit/mobile subpath)
    ├── dist/          # Build output (per-module, mirrors src/)
    └── package.json
```

## package.json Convention

```jsonc
{
  "main": "./dist/index.cjs", // CJS entry (top level, NOT in publishConfig)
  "module": "./dist/index.mjs", // ESM entry for bundlers
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
