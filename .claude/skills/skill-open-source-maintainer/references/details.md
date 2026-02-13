# Open Source Maintainer Detailed Guide

## PR Review Process

### Response Templates

**Bug**:

1. Confirm reproduction
2. Provide fix timeline
3. Suggest PR (or fix directly)

**Feature**:

1. Confirm use case
2. Discuss API
3. Provide implementation guide

**Question**:

1. Give a direct answer
2. Provide example code

### Detailed Feedback Format

```markdown
## 🎉 Great Work!

- Mention what was done well first
- Express gratitude for the contribution

## 🔧 Required Changes

**1. [Test] Missing SSR test**

- Current: No SSR test
- Suggested: Add `renderHookSSR.serverOnly`
- Why: All hooks must have SSR safety verification

**2. [JSDoc] Missing @example**

- Current: No @example
- Suggested: Add a runnable example
- Why: Required for automatic documentation generation

## 💡 Suggestions (Optional)

- Points that would be nice to improve (not required)

## 📝 Next Steps

1. Fix Required Changes
2. Run `yarn test`
3. Push and request review
```

## Breaking Change Protocol

1. **Pre-assessment**: API changes, default value changes, behavior changes
2. **Communication**: Include migration guide in PR
3. **Deprecation**: Consider deprecation warnings before breaking changes

## Label Management

| Label              | Description           | Priority            |
| ------------------ | --------------------- | ------------------- |
| `bug`              | Bug report            | High                |
| `feature`          | Feature request       | Medium              |
| `question`         | Question              | Low (fast response) |
| `good first issue` | For new contributors  | -                   |
| `help wanted`      | Help requested        | -                   |
| `documentation`    | Documentation related | Low                 |

## Core Principles

**Remember**: Open source grows when contributors want to contribute again.

- Think about people before code
- Suggest, don't criticize
- Mistakes are opportunities to learn
- Always explain why

---

## Code Level Review

### Layer Structure

```
src/
├── index.ts              # Public API (top-level export)
├── components/           # Component layer
│   └── {Name}/
│       ├── index.ts      # re-export
│       └── {Name}.tsx
├── hooks/                # Hook layer
│   └── {useName}/
│       ├── index.ts      # re-export
│       ├── {useName}.ts
│       ├── {useName}.spec.ts
│       └── {internal}.ts # Internal utility (optional)
├── utils/                # Utility layer (lowest)
│   └── {name}/
│       ├── index.ts
│       └── {name}.ts
└── _internal/            # Private internal utilities (not exported)
```

**Dependency Direction Principle:**

```
components → hooks → utils → _internal
     ↓          ↓       ↓
   (React)   (React)  (Pure JS)
```

### Dependency Validation Checklist

Dependency rules to check during PR review:

| Rule                  | Allowed                    | Forbidden                  |
| --------------------- | -------------------------- | -------------------------- |
| **Layer direction**   | hooks → utils              | utils → hooks              |
| **Same layer**        | useA → useB (via index.ts) | -                          |
| **Internal file ref** | useA → ../useB/internal.ts | External ref to \_internal |
| **Circular deps**     | -                          | A → B → A                  |

**Validation commands:**

```bash
# Check circular dependencies
npx madge --circular src/

# View dependency graph
npx madge src/index.ts --image deps.png
```

### Breaking Change Detection

**BC check targets (based on src/index.ts):**

| Change Type                 | Breaking? | Example                    |
| --------------------------- | --------- | -------------------------- |
| Removing export             | **Yes**   | Deleting `export { useA }` |
| Renaming export             | **Yes**   | `useA` → `useANew`         |
| Changing function signature | **Yes**   | Adding required parameter  |
| Narrowing return type       | **Yes**   | `{ a, b }` → `{ a }`       |
| Changing default value      | **Maybe** | `leading=false` → `true`   |
| Adding export               | No        | Adding new hook            |
| Adding optional parameter   | No        | Adding optional field      |

**BC check during PR review:**

```bash
# 1. Check index.ts export changes
git diff main -- src/index.ts

# 2. Check public API signature changes
git diff main -- "src/**/index.ts"
```

**Response when BC is found:**

```markdown
## ⚠️ Breaking Change Detected

**Change:** Removed `cancel` method from `useDebounce` return type

**Impact:** Existing code using `cancel()` will break

**Required Actions:**

1. Major version bump (1.x → 2.0)
2. Write migration guide
3. Add Breaking Changes section to CHANGELOG

**Migration Guide:**
\`\`\`diff

- const debounced = useDebounce(fn, 300);
- debounced.cancel();

* const debounced = useDebounce(fn, 300);
* // cancel is no longer supported
  \`\`\`
```

### Internal Dependency Pattern Examples

**Allowed patterns:**

```typescript
// hooks/useDebounce/useDebounce.ts
import { usePreservedCallback } from '../usePreservedCallback/index.ts'; // ✅ Same layer
import { debounce } from './debounce.ts'; // ✅ Internal utility

// hooks/useDebouncedCallback/useDebouncedCallback.ts
import { debounce } from '../useDebounce/debounce.ts'; // ✅ Reusing another hook's internal utility
```

**Forbidden patterns:**

```typescript
// utils/someUtil.ts
import { usePreservedCallback } from '../hooks/usePreservedCallback'; // ❌ Lower → Upper

// components/SomeComponent.tsx
import { debounce } from '../hooks/useDebounce/debounce.ts'; // ⚠️ Direct internal file reference (needs review)
```

---

## Code Writing Patterns

### Test Patterns

**Required structure:**

```typescript
import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { useXxx } from './useXxx.ts';

describe('useXxx', () => {
  // 1. SSR safety test (required, first)
  it('is safe on server side rendering', () => {
    const result = renderHookSSR.serverOnly(() => useXxx());
    expect(result.current).toBeDefined();
  });

  // 2. Initial value test
  it('should initialize with default value', async () => {
    const { result } = await renderHookSSR(() => useXxx());
    expect(result.current).toBe(expectedValue);
  });

  // 3. Behavior test
  it('should do something when action is called', async () => {
    const { result } = await renderHookSSR(() => useXxx());

    act(() => {
      result.current.action();
    });

    expect(result.current.value).toBe(expected);
  });
});
```

**Test checklist:**

| Item          | Required | Description                         |
| ------------- | -------- | ----------------------------------- |
| SSR safety    | **Yes**  | Use `renderHookSSR.serverOnly`      |
| Initial value | Yes      | Test default/provided values        |
| Core behavior | Yes      | Test key functionality              |
| Edge cases    | Yes      | null, undefined, empty arrays, etc. |
| Cleanup       | Yes      | Cleanup behavior on unmount         |
| 100% coverage | **Yes**  | Cover all branches                  |

### JSDoc Required Items

```typescript
/**
 * @description
 * `useXxx` is a React hook that [describe core functionality in one sentence].
 * [Add a second sentence if additional explanation is needed].
 *
 * @param {Type} paramName - Parameter description.
 * @param {Object} [options] - Options object ([] if optional).
 * @param {Type} [options.field] - Option field description. Defaults to `value`.
 *
 * @returns {ReturnType} A tuple/object:
 * - field1 `Type` - Description;
 * - field2 `Type` - Description;
 *
 * @example
 * import { useXxx } from 'react-simplikit';
 *
 * function Component() {
 *   const [value, action] = useXxx(initialValue);
 *
 *   return (
 *     <button onClick={action}>
 *       {value}
 *     </button>
 *   );
 * }
 */
```

**JSDoc checklist:**

| Tag            | Required | Format                           |
| -------------- | -------- | -------------------------------- |
| `@description` | **Yes**  | Wrap function name in backticks  |
| `@param`       | Yes      | `{Type} name - Description.`     |
| `@returns`     | Yes      | Describe each return field       |
| `@example`     | **Yes**  | Include import, must be runnable |

### Type Export Patterns

**Public types (externally exposed):**

```typescript
// hooks/useStorageState/useStorageState.ts
export type Serializable<T> = T extends string | number | boolean
  ? T
  : ToObject<T>;

// hooks/useStorageState/index.ts
export { Serializable, useStorageState } from './useStorageState.ts';

// src/index.ts (if needed)
export type { Serializable } from './hooks/useStorageState/index.ts';
```

**Internal types (internal use only):**

```typescript
// hooks/useStorageState/useStorageState.ts
type StorageStateOptions<T> = { ... };  // Not exported (internal use)
```

**Type checklist:**

| Scenario                        | Handling                           |
| ------------------------------- | ---------------------------------- |
| Types users need to import      | `export type` + index.ts re-export |
| Function parameter/return types | Inline in function signature       |
| Internal helper types           | Do not export                      |

### File Naming Conventions

| Type             | Filename            | Example                     |
| ---------------- | ------------------- | --------------------------- |
| Hook             | `use{Name}.ts`      | `useToggle.ts`              |
| Hook test        | `use{Name}.spec.ts` | `useToggle.spec.ts`         |
| Component        | `{Name}.tsx`        | `ImpressionArea.tsx`        |
| Component test   | `{Name}.spec.tsx`   | `ImpressionArea.spec.tsx`   |
| Internal utility | `{name}.ts`         | `debounce.ts`, `storage.ts` |
| Re-export        | `index.ts`          | -                           |

**Folder structure:**

```
use{Name}/
├── index.ts           # re-export only (no logic)
├── use{Name}.ts       # Implementation
├── use{Name}.spec.ts  # Tests
└── {helper}.ts        # Internal utility (optional)
```

### Public API Design Patterns

**1. Options object pattern:**

```typescript
// ✅ Good: Use an object for options
function useDebounce(callback: F, wait: number, options?: DebounceOptions);

// ❌ Bad: Too many positional parameters
function useDebounce(
  callback: F,
  wait: number,
  leading?: boolean,
  trailing?: boolean
);
```

**2. Return value patterns:**

```typescript
// Tuple: When order is meaningful and destructuring is convenient
const [state, setState] = useToggle();

// Object: When there are many fields or selective usage
const { value, increment, decrement, reset } = useCounter();
```

**3. Function overloads:**

```typescript
// Return type differs based on presence of defaultValue
export function useStorageState<T>(key: string): readonly [T | undefined, ...];
export function useStorageState<T>(key: string, options: { defaultValue: T }): readonly [T, ...];
```

**4. Generic defaults:**

```typescript
// Enable type inference
function usePreservedReference<T>(value: T): T; // T is inferred from value

// When explicit generic is needed
function useStorageState<T>(key: string); // T cannot be inferred, must be explicit
```
