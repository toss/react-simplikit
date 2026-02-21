# disableBodyScrollLock

`disableBodyScrollLock` is a utility function that unlocks the body scroll. It restores the scroll locked by `enableBodyScrollLock` and returns to the saved scroll position. Safe to call in SSR environment (no-op on server). Safe to call even if not locked (no-op).

## Interface

```ts
function disableBodyScrollLock(): void;
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
