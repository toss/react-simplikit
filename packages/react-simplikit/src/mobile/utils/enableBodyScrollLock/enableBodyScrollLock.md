# enableBodyScrollLock

`enableBodyScrollLock` is a utility function that locks the body scroll. It prevents the body from scrolling by applying fixed positioning. This is useful when opening modals, drawers, or other overlay components. Safe to call in SSR environment (no-op on server). Calling multiple times has no effect until unlocked.

## Interface

```ts
function enableBodyScrollLock(): void;
```

### Parameters

### Return Value

<Interface name="" type="void" description="" />

## Example

```tsx
// When modal opens
enableBodyScrollLock();

// When modal closes
disableBodyScrollLock();
```
