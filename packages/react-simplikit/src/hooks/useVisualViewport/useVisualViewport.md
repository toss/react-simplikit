# useVisualViewport

`useVisualViewport` is a React hook that tracks Visual Viewport changes. It returns the actual visible area in mobile WebView, which changes when the keyboard appears or the user zooms/scrolls.

**Important:** `viewport` is `null` on SSR or in browsers that don't support Visual Viewport API. Always check for null before accessing viewport properties.

**Tip:** If you only need keyboard height, use `useKeyboardHeight()` instead for a simpler API.

## Interface

```ts
function useVisualViewport(): { viewport: VisualViewportState | null };
```

### Parameters

### Return Value

<Interface
  name=""
  type="{ viewport: VisualViewportState | null }"
  description="object containing the Visual Viewport state."
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
        'Viewport top offset in pixels from the layout viewport. Becomes negative on iOS when the keyboard appears, so use <code>-offsetTop</code> for the keyboard height. Typically remains 0 on Android.',
    },
    {
      name: 'viewport.scale',
      type: 'number',
      required: false,
      description:
        'Pinch-zoom scaling factor. 1.0 means no zoom, greater than 1.0 means zoomed in.',
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
