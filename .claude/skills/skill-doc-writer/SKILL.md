---
name: doc-writer
description: JSDoc and documentation writing. API documentation, example code generation. Use when documenting code, writing examples.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Documentation Writer

Writes documentation for react-simplikit.

## Quick Start

```bash
/doc-writer  # Specify a file or function to document
```

## JSDoc Standard

```typescript
/**
 * @description Clearly describe what the function does.
 * @param {Type} paramName - Parameter description.
 * @returns {Type} Return value description.
 * @example
 * const result = functionName(input);
 * console.log(result); // expected output
 */
```

## Required Tags

| Tag          | Purpose                           |
| ------------ | --------------------------------- |
| @description | Describe the functionality        |
| @param       | Parameter (type + description)    |
| @returns     | Return value (type + description) |
| @example     | Working example code              |

## Writing Principles

1. **Clarity**: Minimize technical jargon
2. **Completeness**: Document all parameters and return values
3. **Example-driven**: Provide real, usable code
4. **Consistency**: Maintain a uniform format

## Example Writing Guide

- Cover the most common use case
- Should be copy-pasteable and runnable
- Show expected results as comments
