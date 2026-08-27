# useBodyScrollLock

`useBodyScrollLock` is a React hook that locks body scroll while the component is mounted. It automatically locks on mount and unlocks on unmount. **Note:** For multiple overlapping modals, use a single lock at the parent level.

## Interface

```ts
function useBodyScrollLock(): void;
```

### Parameters

### Return Value

This hook does not return anything.

## Example

```tsx
function Modal() {
  useBodyScrollLock();
  return <div className="modal">Modal content</div>;
}
```
