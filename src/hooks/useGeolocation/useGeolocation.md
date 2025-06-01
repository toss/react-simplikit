# useGeolocation

`useGeolocation` is a React hook that retrieves and tracks the user's geographical location. It uses the browser's `Geolocation API` to support both one-time position retrieval and continuous location tracking.

## Interface

```ts
function useGeolocation(options: GeolocationOptions): Object;
```

### Parameters

<Interface
  name="options"
  type="GeolocationOptions"
  description="Geolocation options configuration"
  :nested="[
            {
                     name: 'options.mountBehavior',
type: 'GeolocationMountBehaviorType',
required: false,
description: 'How the hook behaves on mount: - If not provided, no automatic location fetching occurs - 'get': automatically fetches location once when component mounts - 'watch': automatically starts tracking location changes when component mounts'
            },
{
                     name: 'options.enableHighAccuracy',
type: 'boolean',
required: false,
defaultValue: 'false',
description: 'If true, provides more accurate position information (increases battery consumption)'
            },
{
                     name: 'options.maximumAge',
type: 'number',
required: false,
defaultValue: '0',
description: 'Maximum age in milliseconds of a cached position that is acceptable to return'
            },
{
                     name: 'options.timeout',
type: 'number',
required: false,
defaultValue: 'Infinity',
description: 'Maximum time (in milliseconds) allowed for the location request'
            }
          ]"
/>

### Return Value

<Interface
  name=""
  type="Object"
  description="containing location data and related functions"
  :nested="[
    {
      required: false,
    },
  ]"
/>

## Example

```tsx
// Basic usage
const { loading, error, data, getCurrentPosition } = useGeolocation();

// Automatically fetch location when component mounts
const { loading, error, data } = useGeolocation({ mountBehavior: 'get' });

// Location tracking
const { loading, error, data, startTracking, stopTracking, isTracking } =
  useGeolocation();

const handleStartTracking = () => {
  startTracking();
};

const handleStopTracking = () => {
  stopTracking();
};
```
