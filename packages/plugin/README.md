# react-design-philosophy

React design philosophy plugin for Claude Code. Includes skills for reviewing and writing hooks, plus a higher-level React abstraction guide.

## Install

```bash
claude plugin install --source git-subdir \
  --url https://github.com/toss/react-simplikit.git \
  --path packages/plugin
```

## Skills

### /react-design-principles

Design React APIs and abstractions in a React-like way.

- Declarative interfaces over orchestration-heavy helpers
- Lifecycle-safe abstractions instead of generic lifecycle wrappers
- Minimal surfaces, zero-dependency bias, type safety, and documentation
- Best used for library design, API review, and deciding whether an abstraction should exist

### /react-hook-review

Review hooks against 30 design principles. Structured feedback with severity levels.

- 14 coding principles (C1-C14): return values, SSR safety, TypeScript, cleanup, performance
- 16 usage patterns (U1-U17, excluding U4): state design, effect usage, memoization, hook design
- Output: Great Work / Required Changes / Suggestions / Next Steps

### /react-hook-writing

Write hooks following design philosophy. Themed guide with code examples.

- State management patterns (derive, useRef vs useState, useReducer)
- Effect patterns (when to use, cleanup, external store subscription)
- TypeScript, performance, JSDoc templates
- Reference implementations in `patterns.md`

## Principles Overview

| Category                    | Count | Examples                                                                                      |
| --------------------------- | ----- | --------------------------------------------------------------------------------------------- |
| React design                | 5     | Declarative interface, lifecycle respect, minimal surfaces, reliability, zero-dependency bias |
| Coding (C1-C14)             | 14    | Always return objects, SSR-safe init, no `any`, cleanup                                       |
| State Design (U1-U3, U5-U7) | 6     | Derive don't sync, useRef for non-rendered, discriminated unions                              |
| Effect Usage (U8-U14)       | 7     | Effects for sync only, no chains, key reset, async cleanup                                    |
| Memoization (U15-U16)       | 2     | useMemo >= 1ms, useCallback + memo() only                                                     |
| Hook Design (U17)           | 1     | Extract reusable logic, not lifecycle wrappers                                                |

## Philosophy

Every rule includes a "Why" explanation. Opinionated items are transparently marked with trade-offs.

## License

MIT
