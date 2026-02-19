# Copilot Instructions for react-simplikit

## Quick Reference

- Monorepo: `packages/core` (react-simplikit) + `packages/mobile` (@react-simplikit/mobile)
- Architecture: `components → hooks → utils → _internal` (unidirectional, no circular imports)
- Mobile depends on core; core must NOT depend on mobile

## Code Style Rules

- Use `type` not `interface` for type aliases
- Named functions in useEffect: `useEffect(function handleResize() { ... }, [])`
- No default exports — named exports only
- No `any` types — strict TypeScript
- Use `.ts`/`.tsx` extensions in source imports (tsup converts to `.js`)
- Strict boolean checks: `value !== undefined` not `if (value)`
- Zero runtime dependencies
- Always return cleanup in useEffect to remove listeners
- Nullish checks: use `== null` for both null and undefined:
  ```ts
  if (ref == null) { continue; }
  items.filter(item => item != null);
  const controlled = valueProp !== undefined; // only when distinction matters
  ```
- Prefer early returns (guard clauses) over nested if-else blocks
- Function declarations use `function` keyword, not arrow functions:
  ```ts
  // ✅ function toggle(state: boolean) { return !state; }
  // ✅ items.filter(item => item != null)  ← inline callback arrow OK
  // ❌ const toggle = (state: boolean) => !state;
  ```

## SSR-Safe Pattern (CRITICAL)

All browser API access must use this pattern:

```ts
const [state, setState] = useState(FIXED_INITIAL_VALUE);
useEffect(function syncBrowserState() {
  if (isServer()) return;
  setState(getBrowserAPI());
}, []);
```

Never call browser APIs during state initialization.

## Hook Return Values

- 1 value → return directly: `useDebounce<T>(value, delay): T`
- 2 values → tuple: `useToggle(init): [boolean, () => void]`
- 3+ values → object: `usePagination(): { page, nextPage, prevPage }`

## Testing

- 100% coverage required (Vitest)
- SSR test required for browser API hooks:
  ```ts
  import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';
  it('is safe on server side rendering', () => {
    const result = renderHookSSR.serverOnly(() => useHookName());
    expect(result.current).toBeDefined();
  });
  ```

## JSDoc Template

Every public API requires:

````ts
/**
 * @description Brief description of what it does
 * @param paramName - Parameter description
 * @returns What the hook/function returns
 * @example
 * ```ts
 * const value = useHookName(param);
 * ```
 */
````

## File Structure

```
src/hooks/useHookName/
├── index.ts               # Re-export
├── useHookName.ts         # Implementation
├── useHookName.spec.ts    # Tests (core) / useHookName.test.ts (mobile)
├── useHookName.ssr.test.ts # SSR tests
├── useHookName.md         # English docs
└── ko/useHookName.md      # Korean docs
```

## Commands

```bash
yarn build      # Build all packages (tsup)
yarn test       # Run tests (Vitest)
yarn fix        # Auto-fix lint + format
yarn typecheck  # Type check (tsc --noEmit)
```
