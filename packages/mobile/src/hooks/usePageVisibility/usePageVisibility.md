# usePageVisibility

## Interface

```ts
function usePageVisibility(): PageVisibility;
```

### Parameters

### Return Value

<Interface
  name=""
  type="PageVisibility"
  description="visibility information"
  :nested="[
    {
      name: '',
      type: 'isVisible',
      required: false,
      description:
        'True if page is currently visible to the user - <code>visibilityState</code> - Current visibility state<br />  : \'visible\' | \'hidden\'.',
    },
  ]"
/>

## Example

````tsx
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
````

```

```
