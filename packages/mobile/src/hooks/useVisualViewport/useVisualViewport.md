# useVisualViewport

`useVisualViewport` is a React hook that tracks Visual Viewport changes. It returns the actual visible area in mobile WebView, which changes when the keyboard appears or the user zooms/scrolls. **Important:** `viewport` is `null` on SSR or in browsers that don't support Visual Viewport API. Always check for null before accessing viewport properties. **Tip:** If you only need keyboard height, use `useKeyboardHeight()` instead for a simpler API.

## Interface

```ts
function useVisualViewport(): { viewport: VisualViewportState | null };
```

### Parameters

### Return Value

<Interface
  name=""
  type="{ viewport: VisualViewportState | null }"
  description="containing Visual Viewport state, or <code>null</code> viewport if not supported."
/>

## Example

```tsx
function CustomLayout() {
  const { viewport } = useVisualViewport();

  // Always check for null first
  if (!viewport) {
    return <div>Visual Viewport not supported</div>;
  }

  const { width, height, offsetTop, scale } = viewport;

  // Hide floating UI when user zooms in
  const showFloatingUI = scale <= 1.3;

  return (
    <div style={{ height }}>
      {showFloatingUI && <FloatingButton />}
      Viewport-aware content
    </div>
  );
}
```
