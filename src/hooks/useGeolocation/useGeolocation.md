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
      description:
        'How the hook behaves on mount: - If not provided, no automatic location fetching occurs - \'get\': automatically fetches location once when component mounts - \'watch\': automatically starts tracking location changes when component mounts',
    },
    {
      name: 'options.enableHighAccuracy',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        'If true, provides more accurate position information (increases battery consumption)',
    },
    {
      name: 'options.maximumAge',
      type: 'number',
      required: false,
      defaultValue: '0',
      description:
        'Maximum age in milliseconds of a cached position that is acceptable to return',
    },
    {
      name: 'options.timeout',
      type: 'number',
      required: false,
      defaultValue: 'Infinity',
      description:
        'Maximum time (in milliseconds) allowed for the location request',
    },
  ]"
/>

### Return Value

<Interface
  name=""
  type="Object"
  description="containing location data and related functions"
  :nested="[
    {
      name: 'loading',
      type: 'boolean',
      required: false,
      description: 'Whether location data is currently being fetched.',
    },
    {
      name: 'error',
      type: 'CustomGeoLocationError|null',
      required: false,
      description:
        'Error object if an error occurred, or null The hook uses standard Geolocation API error codes (1-3) and adds a custom code (0)<br />  : - 0<br />  : Geolocation is not supported by the environment - 1<br />  : User denied permission to access geolocation - 2<br />  : Position unavailable - 3<br />  : Timeout - geolocation request took too long.',
    },
    {
      name: 'data',
      type: 'GeolocationData|null',
      required: false,
      description:
        'Location data object or null - latitude <code>number</code> - The latitude in decimal degrees - longitude <code>number</code> - The longitude in decimal degrees - accuracy <code>number</code> - The accuracy of position in meters - altitude <code>number|null</code> - The altitude in meters above the WGS84 ellipsoid - altitudeAccuracy <code>number|null</code> - The altitude accuracy in meters - heading <code>number|null</code> - The heading in degrees clockwise from true north - speed <code>number|null</code> - The speed in meters per second - timestamp <code>number</code> - The time when the position was retrieved.',
    },
    {
      name: 'getCurrentPosition',
      type: 'Function',
      required: false,
      description:
        'Function to get the current position once - startTracking <code>Function</code> - Function to start tracking location changes - stopTracking <code>Function</code> - Function to stop tracking location - isTracking <code>boolean</code> - Whether location tracking is currently active.',
    },
  ]"
/>

## Example

```tsx
// Basic usage
const {
  loading,
  error,
  data,
  getCurrentPosition
} = useGeolocation();

// Automatically fetch location when component mounts
const {
  loading,
  error,
  data
} = useGeolocation({ mountBehavior: 'get' });

// Location tracking
const {
  loading,
  error,
  data,
  startTracking,
  stopTracking,
  isTracking
} = useGeolocation();

const handleStartTracking = () => {
  startTracking();
};

const handleStopTracking = () => {
  stopTracking();
};
```
