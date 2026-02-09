# useNetworkStatus

React hook to access Network Information API. Provides raw network connection data including connection type, quality, speed, and user preferences. Returns undefined for all properties if the API is not supported (e.g., Safari, Firefox).

## Interface

```ts
function useNetworkStatus(): NetworkStatus;
```

### Parameters

This hook takes no parameters.

### Return Value

<Interface
name=""
type="NetworkStatus"
description="object with network connection data."
:nested="[
{
name: 'effectiveType',
type: \"'slow-2g' | '2g' | '3g' | '4g' | undefined\",
required: false,
description: 'Connection quality indicator - undefined if API not supported',
},
{
name: 'type',
type: \"'bluetooth' | 'cellular' | 'ethernet' | 'mixed' | 'none' | 'other' | 'unknown' | 'wifi' | 'wimax' | undefined\",
required: false,
description: 'Physical connection type - undefined if API not supported',
},
{
name: 'downlink',
type: 'number | undefined',
required: false,
description: 'Downlink speed in Mbps - undefined if API not supported',
},
{
name: 'rtt',
type: 'number | undefined',
required: false,
description: 'Round-trip time in milliseconds - undefined if API not supported',
},
{
name: 'saveData',
type: 'boolean | undefined',
required: false,
description: \"User's data saver preference - undefined if API not supported\",
},
]"
/>

## Examples

### Adaptive Image Quality

```tsx
function AdaptiveImage() {
  const { effectiveType, saveData } = useNetworkStatus();

  // Determine quality based on your app's needs
  const useHighQuality = effectiveType === '4g' && !saveData;

  return (
    <img src={useHighQuality ? 'high-res.jpg' : 'low-res.jpg'} alt="Content" />
  );
}
```

### Conditional Video Autoplay

```tsx
function VideoPlayer() {
  const { type, downlink } = useNetworkStatus();

  // Custom logic: only autoplay on wifi with good bandwidth
  const shouldAutoplay = type === 'wifi' && (downlink ?? 0) > 5;

  return <video src="video.mp4" autoPlay={shouldAutoplay} />;
}
```

## Notes

### Browser Support

- **Chrome/Edge (Android)**: Full support for all properties
- **Chrome/Edge (Desktop)**: Partial support (effectiveType, downlink, rtt, saveData available; type may be undefined)
- **Firefox**: Not supported (all properties will be undefined)
- **Safari**: Not supported (all properties will be undefined)

### SSR Safety

This hook is SSR-safe. It returns an empty object `{}` on the server and safely subscribes to network changes only in the browser environment.

### Usage Recommendations

1. Always check for undefined values before using them, as the API may not be supported in all browsers
2. Provide fallback behavior for browsers that don't support the Network Information API
3. Use the hook to enhance user experience, not as a required feature
4. Consider combining `effectiveType` and `saveData` for optimal content delivery decisions

### References

- [Network Information API Specification](https://wicg.github.io/netinfo/)
- [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)
