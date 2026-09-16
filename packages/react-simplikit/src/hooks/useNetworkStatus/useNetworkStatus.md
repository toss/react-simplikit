# useNetworkStatus

`useNetworkStatus` is a React hook that provides access to the Network Information API.
It provides raw network connection data such as the connection type, quality, speed and the user's
data saver preference. Every property is `undefined` if the API is not supported (e.g., Safari, Firefox).

## Interface

```ts
function useNetworkStatus(): NetworkStatus;
```

### Parameters

This function does not accept any parameters.

### Return Value

<Interface
  name=""
  type="NetworkStatus"
  description="Network status information"
  :nested="[
    {
      name: 'effectiveType',
      type: '\'slow-2g\' | \'2g\' | \'3g\' | \'4g\' | undefined',
      required: false,
      description:
        'Connection quality, or <code>undefined</code> if the API is not supported.',
    },
    {
      name: 'type',
      type: '\'bluetooth\' | \'cellular\' | \'ethernet\' | \'mixed\' | \'none\' | \'other\' | \'unknown\' | \'wifi\' | \'wimax\' | undefined',
      required: false,
      description:
        'Physical connection type, or <code>undefined</code> if the API is not supported.',
    },
    {
      name: 'downlink',
      type: 'number | undefined',
      required: false,
      description:
        'Downlink speed in Mbps, or <code>undefined</code> if the API is not supported.',
    },
    {
      name: 'rtt',
      type: 'number | undefined',
      required: false,
      description:
        'Round-trip time in milliseconds, or <code>undefined</code> if the API is not supported.',
    },
    {
      name: 'saveData',
      type: 'boolean | undefined',
      required: false,
      description:
        'User\'s data saver preference, or <code>undefined</code> if the API is not supported.',
    },
  ]"
/>

## Example

### Adaptive image quality

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

### Conditional video autoplay

```tsx
function VideoPlayer() {
  const { type, downlink } = useNetworkStatus();

  // Custom logic: only autoplay on wifi with good bandwidth
  const shouldAutoplay = type === 'wifi' && (downlink ?? 0) > 5;

  return <video src="video.mp4" autoPlay={shouldAutoplay} />;
}
```

## Notes

### Browser support

- **Chrome/Edge (Android)**: every property is supported
- **Chrome/Edge (Desktop)**: partial support (`effectiveType`, `downlink`, `rtt` and `saveData` are available; `type` may be `undefined`)
- **Firefox**: not supported (every property is `undefined`)
- **Safari**: not supported (every property is `undefined`)

### SSR safety

The hook is safe during server-side rendering. On the server it returns an empty object `{}` and it subscribes to network changes only in the browser.

### Recommendations

- Always check for `undefined` before using a value, since the API is not available in every browser
- Provide a fallback for browsers without the Network Information API
- Use the hook to enhance the experience rather than for essential features
- Consider `effectiveType` together with `saveData` when deciding what to deliver

### References

- [Network Information API specification](https://wicg.github.io/netinfo/)
- [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)
