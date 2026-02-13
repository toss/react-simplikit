# Package Publishing Detailed Guide

## Initial Setup

### 1. npm Preparation

```bash
npm login
npm profile enable-2fa auth-and-writes
# Generate automation token → Add NPM_TOKEN to GitHub Secrets
```

### 2. Changesets Setup

```bash
npm install -D @changesets/cli
npx changeset init
```

`.changeset/config.json`:

```json
{
  "access": "public",
  "baseBranch": "main",
  "commit": false
}
```

### 3. Full package.json Configuration

```json
{
  "name": "@react-simplikit/mobile",
  "version": "0.1.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "files": ["dist"],
  "sideEffects": false,
  "publishConfig": {
    "access": "public",
    "provenance": true
  }
}
```

### 4. GitHub Actions

`.github/workflows/release.yml`:

```yaml
name: Release
on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      - run: yarn install --immutable
      - run: yarn build
      - uses: changesets/action@v1
        with:
          publish: npm run release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Writing Changesets

```bash
yarn changeset
# → Select packages
# → Select patch/minor/major
# → Write change description

# Example generated file
# .changeset/hungry-cats-dance.md
```

## Provenance

- Authenticates package origin on npm
- Only available through GitHub Actions
- Set `publishConfig.provenance: true`
