---
name: scaffolder
description: Scaffold new hooks/components/utilities. Generate standard structure and boilerplate. Use when creating new hooks, components, utilities.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# Scaffolder

Creates new hooks, components, and utilities with a standard structure.

## Quick Start

```bash
/scaffolder useNewHook    # Create a hook
/scaffolder MyComponent   # Create a component
/scaffolder myUtil        # Create a utility
```

## Generated Structure

```
src/{type}/{name}/
├── {name}.ts          # Implementation
├── {name}.spec.ts     # Tests
└── index.ts           # Export
```

## Hook Template

```typescript
/**
 * @description Hook description.
 * @param {T} param - Parameter description.
 * @returns {T} Return description.
 * @example
 * const result = useHookName(input);
 */
export function useHookName<T>(param: T): T {
  // implementation
}
```

## Test Template

```typescript
import { renderHook } from '@testing-library/react';
import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

describe('useHookName', () => {
  it('is safe on server side rendering', () => {
    const result = renderHookSSR.serverOnly(() => useHookName('test'));
    expect(result.current).toBeDefined();
  });

  it('works correctly', () => {
    const { result } = renderHook(() => useHookName('test'));
    expect(result.current).toBe('test');
  });
});
```

## Workflow

1. Confirm the name and type
2. Create the folder structure
3. Generate template files
4. Add export to src/index.ts
