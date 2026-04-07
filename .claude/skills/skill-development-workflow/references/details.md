# Development Workflow Detailed Guide

## Detailed Steps

### Scaffold Output

```
src/hooks/useNewHook/
├── useNewHook.ts
├── useNewHook.spec.ts
└── index.ts
```

### Implementation Checklist

- [ ] 4 required JSDoc tags
- [ ] TypeScript strict mode compliance
- [ ] SSR safety ensured
- [ ] Zero dependencies

### Implementation Template

```typescript
/**
 * @description What it does.
 * @param {T} value - Description.
 * @returns {T} Description.
 * @example
 * const result = useNewHook(input);
 */
export function useNewHook<T>(value: T): T {
  // implementation
}
```

### Testing Checklist

- [ ] SSR test (required)
- [ ] Basic behavior test
- [ ] Edge cases (null, undefined, empty)
- [ ] State change test
- [ ] 100% coverage

### Self-Review Checklist

- [ ] SSR test included
- [ ] 100% coverage
- [ ] JSDoc complete
- [ ] TypeScript types accurate
- [ ] API consistency

## Quick Commands

```bash
yarn scaffold NAME --type h|c|u  # Generate
yarn test                        # Full test
yarn test:coverage              # Coverage
yarn changeset                  # Release preparation
yarn fix                        # Auto fix
```
