---
name: development-workflow
description: Complete workflow from new Hook/Component/Util development to deployment. Use when starting new feature development.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Development Workflow Guide

## Quick Start

```
Scaffold → Implementation → Testing → Documentation → Review → Changeset → Merge
```

## Workflow Steps

### 1. Scaffold

```bash
yarn scaffold useNewHook --type h   # Hook
yarn scaffold MyComponent --type c   # Component
```

### 2. Implementation

- Write JSDoc
- Implement functionality
- Ensure accurate TypeScript types

### 3. Testing (100% coverage required)

```bash
yarn test:spec
yarn test:coverage
```

- SSR testing required
- Handle edge cases

### 4. Documentation

- @description, @param, @returns, @example

### 5. Review

```bash
yarn test          # Full validation
yarn test:type     # Type check
yarn test:lint     # Lint
```

### 6. Changeset

```bash
yarn changeset
# patch: Bug fix
# minor: New feature
# major: Breaking change
```

### 7. Merge

```bash
git checkout -b feat/add-use-new-hook
git add . && git commit -m "feat: add useNewHook"
gh pr create
```

## References

- [details.md](references/details.md) - Detailed guide
