---
name: jsdoc-guide
description: JSDoc writing rules for AI-powered documentation generation. Use when writing JSDoc, documenting functions, or adding code comments.
allowed-tools: Read, Edit
---

# JSDoc Writing Guide

## Quick Start

All exported functions require 4 mandatory tags:

```typescript
/**
 * @description One-line summary.
 * @param {Type} name - Description.
 * @returns {Type} Description.
 * @example
 * const result = useHook(input);
 */
```

## Core Patterns

### 1. @description - First line is a one-sentence summary

```typescript
// ✅ Good
@description Debounces a value and returns it after the specified delay.

// ❌ Bad
@description Does something with a value.
```

### 2. @param - Type + description

```typescript
@param {T} value - The value to debounce.
@param {number} [delay=300] - Optional delay in ms.
@param {Object} options - Configuration object.
```

### 3. @returns - Return value description

```typescript
// Simple
@returns {T} The debounced value.

// Tuple
@returns {[boolean, () => void]} [state, toggle]
```

### 4. @example - Runnable code

```typescript
@example
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);
```

## References

- [details.md](references/details.md) - Full tag guide, complex cases
