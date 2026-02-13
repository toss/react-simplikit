---
name: package-publishing
description: npm publishing, Changesets, GitHub Actions automated deployment. Use when publishing packages, creating releases.
allowed-tools: Bash, Read, Write
---

# Package Publishing Guide

## Quick Start

```bash
# Create changeset
yarn changeset

# Test publishing
npm publish --dry-run
```

## Core Patterns

### Publishing Flow

```
PR + Changeset → Merge → Version PR → Merge → Auto Deploy
```

### Changeset Versioning

| Change      | Version | Example       |
| ----------- | ------- | ------------- |
| Bug fix     | patch   | 0.1.0 → 0.1.1 |
| New feature | minor   | 0.1.0 → 0.2.0 |
| Breaking    | major   | 0.1.0 → 1.0.0 |

### Required package.json Settings

```json
{
  "files": ["dist"],
  "sideEffects": false,
  "publishConfig": {
    "access": "public",
    "provenance": true
  }
}
```

## Verification

```bash
npm run build --workspaces
npm publish --dry-run
npm info react-simplikit
```

## References

- [details.md](references/details.md) - GitHub Actions, npm configuration details
