# usePageVisibility

`usePageVisibility` is a React hook that detects page visibility changes. It monitors when the user switches tabs or minimizes the browser using the Page Visibility API. Useful for pausing/resuming animations, videos, or background tasks.

**SSR Behavior**: Returns `{ isVisible: true, visibilityState: 'visible' }` during server-side rendering.

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
