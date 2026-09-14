# useBodyScrollLock

`useBodyScrollLock` is a React hook that locks body scroll while the component is mounted. It automatically locks on mount and unlocks on unmount. It is useful for overlay components such as modals and drawers that need to prevent background scrolling.

## Interface

```ts
function useBodyScrollLock(): void;
```

### Parameters

This function does not accept any parameters.

### Return Value

This hook does not return anything.

## Example

### Basic Usage

```tsx
function Modal() {
  useBodyScrollLock();
  return <div className="modal">Modal content</div>;
}
```

### Multiple Modals - Single Lock Pattern

When multiple modals overlap, use a single lock at the parent level instead of applying a separate lock to each modal.

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

- **SSR safety**: Because this hook uses `useEffect`, it runs only on the client, making it safe to use with server-side rendering (SSR).
- **Automatic cleanup**: When the component unmounts, the scroll lock is automatically released, ensuring proper cleanup.
- **Multiple modals**: When multiple modals overlap, do not apply a separate lock to each modal. Implement a single lock at the parent level instead. This prevents conflicts and ensures consistent behavior.
- **Browser support**: This hook works in all modern browsers that support the CSS changes applied by the `enableBodyScrollLock` and `disableBodyScrollLock` utilities.
