# API Design Detailed Guide

## Hook Design

### Naming

```typescript
// ✅ use prefix
useDebounce(), useToggle(), useInterval();

// ❌ unclear
debounce(), toggle();
```

### Return Values in Detail

```typescript
// Single value - simple transformation
function useDebounce<T>(value: T, delay: number): T;

// Tuple - state + single action
function useToggle(init = false): [boolean, () => void];
function useBoolean(init = false): [boolean, { on; off; toggle }];

// Object - complex state
function usePagination(): {
  page: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
};
```

## Component Design

### Props Naming

```typescript
// ✅ Boolean without prefix
<Button disabled={true} loading={false} />

// ❌ Avoid
<Button isDisabled={true} isLoading={false} />
```

### Ref Forwarding

```typescript
export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ children }, ref) => (
    <button ref={ref}>{children}</button>
  )
);
Button.displayName = 'Button';
```

## Utility Design

### Pure Functions

```typescript
// ✅ No side effects
export function mergeRefs<T>(...refs: Ref<T>[]): RefCallback<T>;

// ❌ Side effects
let global: any;
export function setState(v: any) {
  global = v;
}
```

## TypeScript

```typescript
// ✅ Leverage inference
function useDebounce<T>(value: T, delay: number): T;

// ✅ as const for tuples
return [value, toggle] as const;

// ❌ Using any
function useDebounce(value: any): any;
```

## Checklist

- [ ] Name clearly describes the functionality
- [ ] No prefix on boolean props
- [ ] TypeScript inference maximized
- [ ] SSR tests written
- [ ] Named exports used
- [ ] JSDoc complete
