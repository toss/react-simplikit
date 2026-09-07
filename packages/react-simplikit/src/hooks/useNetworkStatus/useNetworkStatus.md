# useNetworkStatus

`useNetworkStatus` is a React hook that provides access to the Network Information API. It provides raw network connection data. Returns undefined for all properties if the API is not supported (e.g., Safari, Firefox).

**Browser Support**:

- Chrome/Edge (Android): Full support
- Chrome/Edge (Desktop): Partial support (effectiveType, downlink, rtt, saveData)
- Firefox: Not supported
- Safari: Not supported

## Interface

```ts
function useNetworkStatus(): NetworkStatus;
```

### Parameters

### Return Value

<Interface
  name=""
  type="NetworkStatus"
  description="status information"
  :nested="[
    {
      name: '',
      type: 'effectiveType',
      required: false,
      description:
        'Connection quality<br />  : \'slow-2g\' | \'2g\' | \'3g\' | \'4g\' - <code>type</code> - Physical connection<br />  : \'wifi\' | \'cellular\' | \'ethernet\' | etc. - <code>downlink</code> - Downlink speed in Mbps - <code>rtt</code> - Round-trip time in milliseconds - <code>saveData</code> - User\'s data saver preference.',
    },
  ]"
/>

## Example

```tsx
function AdaptiveImage() {
  const { effectiveType, saveData } = useNetworkStatus();

  // Determine quality based on your app's needs
  const useHighQuality = effectiveType === '4g' && !saveData;

  return (
    <img src={useHighQuality ? 'high-res.jpg' : 'low-res.jpg'} alt="Content" />
  );
}

function VideoPlayer() {
  const { type, downlink } = useNetworkStatus();

  // Custom logic: only autoplay on wifi with good bandwidth
  const shouldAutoplay = type === 'wifi' && (downlink ?? 0) > 5;

  return <video src="video.mp4" autoPlay={shouldAutoplay} />;
}
```
