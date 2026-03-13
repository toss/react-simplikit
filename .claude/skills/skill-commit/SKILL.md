---
name: commit
description: Create commits following repo conventions. Use when committing changes, creating commit messages.
allowed-tools: Bash, Read, Glob, Grep
---

# Git Commit Skill

## Quick Start

```bash
/commit  # Analyze changes and auto-commit
```

## Commit Message Format

```
<type>(<scope>): <description>
```

## Core Patterns

### Type

| Type     | Purpose       |
| -------- | ------------- |
| feat     | New feature   |
| fix      | Bug fix       |
| chore    | Build, config |
| refactor | Refactoring   |
| docs     | Documentation |
| test     | Tests         |

### Scope

| Category | Example          |
| -------- | ---------------- |
| Package  | `core`, `mobile` |
| None     | Omit scope       |

### Examples

```bash
feat(core): add useDebounce hook
feat(mobile): add useKeyboardHeight hook
fix: correct SSR rendering logic
docs: update useToggle documentation
chore: add claude skills
```

## Execution Steps

1. `git status` - Check changed files
2. `git diff` - Analyze changes
3. Determine type, scope, and description
4. `git add .` + `git commit`

## References

- [details.md](references/details.md) - Full conventions and complex cases
