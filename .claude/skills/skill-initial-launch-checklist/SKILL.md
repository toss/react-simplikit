---
name: initial-launch-checklist
description: Checklist items to verify before the first open source library release. Use when preparing first release, launching open source.
allowed-tools: Read, Bash, Glob, Grep
---

# Open Source Launch Checklist

## Quick Check

```bash
[ -f README.md ] && echo "✅ README"
[ -f LICENSE ] && echo "✅ LICENSE"
yarn test && echo "✅ Tests pass"
yarn build && echo "✅ Build success"
```

## Phase Checklist

### Phase 1: Repository Setup

- [ ] Set repository to public
- [ ] README.md, LICENSE
- [ ] CONTRIBUTING.md, CODE_OF_CONDUCT.md

### Phase 2: Code Quality

- [ ] 100% test coverage
- [ ] SSR testing complete
- [ ] TypeScript strict mode

### Phase 3: Build & Documentation

- [ ] `yarn build` succeeds
- [ ] ESM + CJS build
- [ ] JSDoc for all exports

### Phase 4: package.json

- [ ] name, version, description
- [ ] main, module, types, exports
- [ ] files: ["dist"], sideEffects: false

### Phase 5: Deployment Setup

- [ ] npm account + 2FA
- [ ] NPM_TOKEN GitHub Secret
- [ ] Changesets + GitHub Actions

## References

- [details.md](references/details.md) - Full phase details
