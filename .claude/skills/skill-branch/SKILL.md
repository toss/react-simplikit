---
name: branch
description: Create branches following repo conventions. Use when creating branches, starting new features.
allowed-tools: Bash
---

# Git Branch Skill

## Quick Start

```bash
/branch feat user-authentication  # → feat/user-authentication
/branch fix login-error           # → fix/login-error
/branch                           # interactive creation
```

## Core Patterns

| Pattern           | Purpose       | Example                       |
| ----------------- | ------------- | ----------------------------- |
| `feat/{name}`     | New feature   | `feat/use-debounce`           |
| `fix/{name}`      | Bug fix       | `fix/ssr-hydration-mismatch`  |
| `chore/{name}`    | Config/build  | `chore/update-build-config`   |
| `docs/{name}`     | Documentation | `docs/add-use-toggle-example` |
| `refactor/{name}` | Refactoring   | `refactor/cleanup-internals`  |

## Execution Steps

1. Confirm task details
2. Determine the appropriate branch type
3. Generate an English branch name (lowercase, hyphens)
4. Run `git checkout -b {branch}`

## Cautions

- Branch names: lowercase English + hyphens only
- Spaces are converted to hyphens
- Korean descriptions are converted to English
- Warn if there are uncommitted changes

## References

- [details.md](references/details.md) - Detailed branch naming guide
