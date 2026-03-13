---
name: test-writer
description: Write test code. 100% coverage, SSR tests, edge cases. Use when writing tests, adding test coverage.
allowed-tools: Read, Write, Edit, Bash
---

# Test Writer

Writes tests that achieve 100% coverage.

## Quick Start

```bash
yarn test:spec      # Run a single test
yarn test:coverage  # Check coverage
```

## Core Patterns

### 1. SSR Test (Required)

```typescript
it('is safe on server side rendering', () => {
  const result = renderHookSSR.serverOnly(() => useHook());
  expect(result.current).toBeDefined();
});
```

### 2. Basic Behavior Test

```typescript
it('returns expected value', () => {
  const { result } = renderHook(() => useHook(input));
  expect(result.current).toBe(expected);
});
```

### 3. Edge Cases

```typescript
it('handles null/undefined', () => { ... });
it('handles empty values', () => { ... });
```

### 4. State Change Test

```typescript
it('updates when state changes', () => {
  const { result, rerender } = renderHook(({ value }) => useHook(value), {
    initialProps: { value: 'initial' },
  });
  rerender({ value: 'updated' });
  expect(result.current).toBe('updated');
});
```

## Coverage Check

All lines, branches, and functions must have 100% coverage.

## References

- [details.md](references/details.md) - Advanced test patterns
