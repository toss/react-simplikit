# usePageVisibility

React hook to detect page visibility changes.

Monitors when the user switches tabs or minimizes the browser using the Page Visibility API. This is useful for pausing/resuming animations, videos, or background tasks to improve performance and user experience.

## Interface

```ts
function usePageVisibility(): PageVisibility;
```

### Parameters

This hook takes no parameters.

### Return Value

<Interface
name=""
type="PageVisibility"
description="object with page visibility state."
:nested="[
{
name: 'isVisible',
type: 'boolean',
required: false,
description: '<code>true</code> if the page is currently visible to the user',
},
{
name: 'visibilityState',
type: \"'visible' | 'hidden'\",
required: false,
description: 'Current visibility state of the page',
},
]"
/>

## Examples

### Video Player Control

Automatically pause video playback when the user switches to another tab:

```tsx
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

### Analytics Tracking

Track when users leave or return to your page:

```tsx
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

- **SSR Safety**: During server-side rendering, this hook returns `{ isVisible: true, visibilityState: 'visible' }` as a safe default since the Page Visibility API is not available on the server.
- **Browser Support**: The Page Visibility API is supported in all modern browsers. See [MDN Browser Compatibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API#browser_compatibility) for details.
- **Performance**: The hook uses the native `visibilitychange` event, which is highly optimized and has minimal performance impact.
- **Visibility States**: The hook excludes the deprecated `'prerender'` state and only returns `'visible'` or `'hidden'`.
