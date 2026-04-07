# Git Branch Detailed Guide

## Branch Types in Detail

### feat (New Feature)

```
feat/{feature-name}
```

- Used when developing a new feature
- Examples: `feat/use-debounce`, `feat/add-keyboard-height-hook`

### fix (Bug Fix)

```
fix/{fix-description}
```

- Used when fixing a bug
- Examples: `fix/ssr-hydration-mismatch`, `fix/scroll-direction-cleanup`

### chore (Config/Build)

```
chore/{description}
```

- Used when changing build config, CI, dependencies, etc.
- Examples: `chore/update-build-config`, `chore/add-changesets`

### docs (Documentation)

```
docs/{description}
```

- Used when adding or modifying documentation
- Examples: `docs/add-use-toggle-example`, `docs/update-contributing`

### refactor (Refactoring)

```
refactor/{description}
```

- Used for code refactoring
- Examples: `refactor/cleanup-internals`, `refactor/simplify-hook-logic`

## Naming Conversion Rules

| Input                       | Output                 |
| --------------------------- | ---------------------- |
| user authentication feature | user-authentication    |
| SSR hydration error         | ssr-hydration-mismatch |
| update build config         | update-build-config    |

## Cautions

- No special characters allowed (only hyphens)
- Avoid overly long branch names (3-4 words recommended)
- If there are uncommitted changes, stash or commit before creating a branch
