# usePageVisibility

`usePageVisibility` is a React hook that detects page visibility changes. It monitors when the user switches tabs or minimizes the browser using the Page Visibility API. Useful for pausing/resuming animations, videos, or background tasks to improve performance and the user experience.

## Interface

```ts
function usePageVisibility(): PageVisibility;
```

### Parameters

This function does not accept any parameters.

### Return Value

<Interface
  name=""
  type="PageVisibility"
  description="Page visibility information"
  :nested="[
    {
      name: 'isVisible',
      type: 'boolean',
      required: false,
      description:
        '<code>true</code> if the page is currently visible to the user.',
    },
    {
      name: 'visibilityState',
      type: '\'visible\' | \'hidden\'',
      required: false,
      description: 'Current visibility state.',
    },
  ]"
/>

## Example

### Video player control

```tsx
// Pauses the video automatically when the user switches to another tab
function VideoPlayer() {
  const { isVisible } = usePageVisibility();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Pause video when tab is hidden
    if (!isVisible) {
      videoRef.current.pause();
    }
  }, [isVisible]);

  return <video ref={videoRef} src="video.mp4" />;
}
```

### Analytics tracking

```tsx
// Tracks when the user leaves or returns to the page
function Analytics() {
  const { isVisible, visibilityState } = usePageVisibility();

  useEffect(() => {
    if (visibilityState === 'hidden') {
      // Track when user leaves the page
      analytics.track('page_hidden');
    }
  }, [visibilityState]);

  return null;
}
```

## Notes

- **SSR safety**: The Page Visibility API is unavailable during server-side rendering, so the hook returns the safe default `{ isVisible: true, visibilityState: 'visible' }`.
- **Browser support**: The Page Visibility API is supported in every modern browser. See the [MDN browser compatibility table](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API#browser_compatibility) for details.
- **Performance**: The hook listens to the native `visibilitychange` event, so it adds no polling and negligible overhead.
- **Visibility state**: Only `'visible'` and `'hidden'` are returned; the deprecated `'prerender'` state is excluded.
