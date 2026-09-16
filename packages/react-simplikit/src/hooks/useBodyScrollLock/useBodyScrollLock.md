# useBodyScrollLock

`useBodyScrollLock` is a React hook that locks body scroll while the component is mounted. It automatically locks on mount and unlocks on unmount. It is useful for overlay components such as modals and drawers that must keep the page behind them from scrolling.

## Interface

```ts
function useBodyScrollLock(): void;
```

### Parameters

This function does not accept any parameters.

### Return Value

This hook does not return anything.

## Example

### Basic usage

```tsx
function Modal() {
  useBodyScrollLock();
  return <div className="modal">Modal content</div>;
}
```

### Multiple modals - single lock pattern

```tsx
// Lock once at the parent level instead of in every overlapping modal
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

- **SSR safety**: The lock is applied inside `useEffect`, which only runs on the client, so the hook is safe during server-side rendering.
- **Automatic cleanup**: The lock is released when the component unmounts.
- **Multiple modals**: When several modals overlap, lock once at the parent level instead of in each modal to avoid conflicts and keep the behaviour consistent.
- **How it locks**: `enableBodyScrollLock` fixes the `body` in place (`position: fixed` with `overflow: hidden`) and saves the scroll position in a data attribute; `disableBodyScrollLock` removes those styles and restores the position.
