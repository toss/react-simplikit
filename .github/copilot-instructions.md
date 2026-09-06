# Copilot Instructions for react-simplikit

> Full coding standards with examples: see [AGENTS.md](../../AGENTS.md)

## Quick Reference

- Monorepo: the library is `packages/react-simplikit`; mobile web hooks live under `src/mobile` and share the same public API
- Architecture: `components → hooks → utils → _internal` (unidirectional, no circular imports)
- Nothing outside `src/mobile` imports from it; `src/mobile` may use `src/utils` and `_internal` (test infrastructure is exempt)

## Code Style Rules

- Use `type` not `interface` for type aliases
- Named functions in useEffect: `useEffect(function handleResize() { ... }, [])`
- No default exports — named exports only
- No `any` types — strict TypeScript
- Use `.ts`/`.tsx` extensions in source imports (tsdown rewrites them to `.mjs`/`.cjs`)
- No implicit boolean coercion: `if (value)` → `if (value != null)` (enforced by `strict-boolean-expressions`)
- Nullish checks: `== null` for both null and undefined, `!== undefined` only when distinction matters
- Zero runtime dependencies
- Always return cleanup in useEffect to remove listeners
- Prefer early returns (guard clauses) over nested if-else blocks
- Function declarations use `function` keyword, not arrow functions
- Short inline callbacks (map, filter args) are OK with arrow functions
