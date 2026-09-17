# useVisualViewport

`useVisualViewport` is a React hook that tracks Visual Viewport changes.
It returns the actual visible area in mobile WebView, which changes when
the keyboard appears or the user zooms/scrolls.

## Interface

```ts
function useVisualViewport(): { viewport: VisualViewportState | null };
```

### Parameters

This function does not accept any parameters.

### Return Value

<Interface
  name=""
  type="{ viewport: VisualViewportState | null }"
  description="An object containing the Visual Viewport state."
  :nested="[
    {
      name: 'viewport',
      type: 'VisualViewportState | null',
      required: false,
      description:
        'Visual Viewport state object, or <code>null</code> if not supported (SSR or browsers without the Visual Viewport API).',
    },
    {
      name: 'viewport.width',
      type: 'number',
      required: false,
      description: 'Viewport width in pixels.',
    },
    {
      name: 'viewport.height',
      type: 'number',
      required: false,
      description: 'Viewport height in pixels.',
    },
    {
      name: 'viewport.offsetLeft',
      type: 'number',
      required: false,
      description:
        'Viewport left offset in pixels from the layout viewport. Typically 0 unless horizontal scrolling or panning occurs.',
    },
    {
      name: 'viewport.offsetTop',
      type: 'number',
      required: false,
      description:
        'Viewport top offset in pixels from the layout viewport. Becomes negative on iOS when the keyboard appears (e.g., -300px means a 300px keyboard), so use <code>-offsetTop</code> for the keyboard height. Typically remains 0 on Android.',
    },
    {
      name: 'viewport.scale',
      type: 'number',
      required: false,
      description:
        'Pinch-zoom scaling factor. 1.0 means no zoom, greater than 1.0 means zoomed in, and less than 1.0 means zoomed out (rare, depends on viewport settings).',
    },
  ]"
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

### Detecting zoom

```tsx
const { viewport } = useVisualViewport();
if (viewport && viewport.scale > 1.3) {
  // Hide floating UI when user zooms in
  setShowFloatingButton(false);
}
```

## Notes

- **SSR safety**: `viewport` is `null` during server-side rendering and in browsers without the Visual Viewport API. Always check for `null` before reading its properties.
- **Browser support**: The Visual Viewport API is supported in modern mobile browsers. Where it is missing the hook returns `null`.
- **Performance**: Updates are wrapped in React's `startTransition` so viewport changes do not block urgent rendering.
- **Simpler alternative**: If you only need the keyboard height, use `useKeyboardHeight()` for a simpler API.
- **Platform differences**: On iOS `offsetTop` becomes negative when the keyboard appears; on Android it typically stays at 0.
- **Use cases**: Detecting the keyboard, reacting to pinch-zoom gestures, building viewport-aware layouts, and showing or hiding UI by zoom level.
