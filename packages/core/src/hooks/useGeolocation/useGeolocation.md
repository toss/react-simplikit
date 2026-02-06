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
        'How the hook behaves on mount: <br />- If not provided, no automatic location fetching occurs <br />- \'get\': automatically fetches location once when component mounts <br />- \'watch\': automatically starts tracking location changes when component mounts',
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
        'Error object if an error occurred, or null The hook uses standard Geolocation API error codes (<code>1-3</code>) and adds a custom code (<code>0</code>) <br />  : <code>0</code> - Geolocation is not supported by the environment <br />  : <code>1</code> - User denied permission to access geolocation <br />  : <code>2</code> - Position unavailable <br />  : <code>3</code> - Timeout - geolocation request took too long.',
    },
    {
      name: 'data',
      type: 'GeolocationData|null',
      required: false,
      description:
        'Location data object or null <br />  : latitude <code>number</code> - The latitude in decimal degrees <br />  : longitude <code>number</code> - The longitude in decimal degrees <br />  : accuracy <code>number</code> - The accuracy of position in meters <br />  : altitude <code>number|null</code> - The altitude in meters above the WGS84 ellipsoid <br />  : altitudeAccuracy <code>number|null</code> - The altitude accuracy in meters <br />  : heading <code>number|null</code> - The heading in degrees clockwise from true north <br />  : speed <code>number|null</code> - The speed in meters per second <br />  : timestamp <code>number</code> - The time when the position was retrieved.',
    },
    {
      name: 'getCurrentPosition',
      type: 'Function',
      required: false,
      description: 'Function to get the current position once.',
    },
    {
      name: 'startTracking',
      type: 'Function',
      required: false,
      description: 'Function to start tracking location changes.',
    },
    {
      name: 'stopTracking',
      type: 'Function',
      required: false,
      description: 'Function to stop tracking location.',
    },
    {
      name: 'isTracking',
      type: 'boolean',
      required: false,
      description: 'Whether location tracking is currently active.',
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
