---
name: monorepo-setup
description: Workspace-based monorepo configuration. Adding new packages, dependency management, build setup. Use when setting up monorepo, adding packages.
allowed-tools: Read, Write, Edit, Bash, Glob
---

# Monorepo Setup Guide

## Structure

```
react-simplikit/
├── package.json              # root (workspace + react-simplikit)
├── packages/
│   └── mobile/               # @react-simplikit/mobile
└── [lockfile]
```

## Quick Start

```bash
# Full build
yarn build

# Specific package
yarn workspace @react-simplikit/mobile build
```

## Workspace Configuration

### Root package.json

```json
{
  "name": "react-simplikit",
  "workspaces": ["packages/*"],
  "scripts": {
    "build": "yarn workspaces foreach -Ap run build",
    "test": "yarn workspaces foreach -Ap run test"
  }
}
```

### Package package.json

```json
{
  "name": "@react-simplikit/mobile",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "peerDependencies": { "react": ">=18.0.0" }
}
```

## Dependency Management

| Location | Dependency Type | Example            |
| -------- | --------------- | ------------------ |
| root     | Dev tools       | typescript, vitest |
| package  | peerDep         | react              |

## References

- [details.md](references/details.md) - Adding new packages, tsup configuration
