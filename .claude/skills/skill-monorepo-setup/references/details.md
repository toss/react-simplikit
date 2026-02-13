# Monorepo Setup Detailed Guide

## Full Package package.json

```json
{
  "name": "@react-simplikit/mobile",
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
  "peerDependencies": { "react": ">=18.0.0" }
}
```

## Adding Dependencies

```bash
# Add to root
yarn add -D typescript

# Add to workspace
yarn workspace @react-simplikit/mobile add pkg
```

## Adding a New Package

```bash
mkdir -p packages/new-package/src
cd packages/new-package

# Create package.json
# Copy tsconfig.json, tsup.config.ts
# Write src/index.ts
# Test the build
```

## Build Configuration (tsup)

```typescript
// tsup.config.ts
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  treeshake: true,
  banner: { js: '"use client";' },
});
```

## Commands

```bash
# All packages
yarn build
yarn test

# Specific package
yarn workspace @react-simplikit/mobile build
```
