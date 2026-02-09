# useBodyScrollLock

A React hook that locks body scroll when mounted and automatically unlocks when unmounted. This is particularly useful for modals, drawers, and other overlay components that should prevent background scrolling.

## Interface

```ts
function useBodyScrollLock(): void;
```

### Parameters

This hook takes no parameters.

### Return Value

This hook returns `void` (no return value).

## Examples

### Basic Usage

```tsx
function Modal() {
  useBodyScrollLock();
  return <div className="modal">Modal content</div>;
}
```

### Multiple Modals - Single Lock Pattern

When you have multiple overlapping modals, use a single lock at the parent level instead of applying the lock to each modal individually.

```tsx
// Multiple modals - single lock pattern
function BodyScrollLock() {
  useBodyScrollLock();
  return null;
}

function App() {
  const hasModal = showModal1 || showModal2;

  return (
    <>
      {hasModal && <BodyScrollLock />}
      {showModal1 && <Modal1 />}
      {showModal2 && <Modal2 />}
    </>
  );
}
```

## Notes

- **SSR Safety**: This hook uses `useEffect`, which only runs on the client side, making it safe for server-side rendering (SSR).
- **Automatic Cleanup**: The scroll lock is automatically removed when the component unmounts, ensuring proper cleanup.
- **Multiple Modals**: For scenarios with multiple overlapping modals, implement a single lock at the parent level rather than applying locks to each modal individually. This prevents conflicts and ensures consistent behavior.
- **Browser Support**: Works in all modern browsers that support the underlying CSS modifications applied by the `enableBodyScrollLock` and `disableBodyScrollLock` utilities.
