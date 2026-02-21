# useNetworkStatus

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

````tsx
```tsxp
function AdaptiveImage() {
  const { effectiveType, saveData } = useNetworkStatus();

  // Determine quality based on your app's needs
  const useHighQuality = effectiveType === '4g' && !saveData;

  return (
    <img
      src={useHighQuality ? 'high-res.jpg' : 'low-res.jpg'}
      alt="Content"
    />
  );
}
````

```

```
