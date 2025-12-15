import { useCallback, useEffect, useRef, useState } from 'react';

export class CustomGeoLocationError extends Error {
  code: number;

  constructor({ code, message }: { message: string; code: number }) {
    super(message);
    this.name = 'CustomGeoLocationError';
    this.code = code;
  }
}

type GeolocationData = {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
};

const GeolocationMountBehavior = {
  GET: 'get',
  WATCH: 'watch',
} as const;

type GeolocationMountBehaviorType = (typeof GeolocationMountBehavior)[keyof typeof GeolocationMountBehavior];

type GeolocationOptions = {
  mountBehavior?: GeolocationMountBehaviorType;
} & PositionOptions;

/**
 * @deprecated This hook is deprecated as it depends on browser-specific APIs (navigator.geolocation).
 * react-simplikit is now focused on platform-independent, pure state/logic hooks.
 * This hook will be removed in a future major version.
 *
 * @description
 * `useGeolocation` is a React hook that retrieves and tracks the user's geographical location.
 * It uses the browser's `Geolocation API` to support both one-time position retrieval and continuous location tracking.
 *
 * @param {GeolocationOptions} [options] - Geolocation options configuration
 * @param {GeolocationMountBehaviorType} [options.mountBehavior] - How the hook behaves on mount:
 *   -- If not provided, no automatic location fetching occurs
 *   -- `get`: automatically fetches location once when component mounts
 *   -- `watch`: automatically starts tracking location changes when component mounts
 * @param {boolean} [options.enableHighAccuracy=false] - If true, provides more accurate position information (increases battery consumption)
 * @param {number} [options.maximumAge=0] - Maximum age in milliseconds of a cached position that is acceptable to return
 * @param {number} [options.timeout=Infinity] - Maximum time (in milliseconds) allowed for the location request
 *
 * @returns {Object} Object containing location data and related functions
 * - loading `boolean` - Whether location data is currently being fetched;
 * - error `CustomGeoLocationError|null` - Error object if an error occurred, or null
 *   The hook uses standard Geolocation API error codes (`1-3`) and adds a custom code (`0`)
 *   : `0` - Geolocation is not supported by the environment
 *   : `1` - User denied permission to access geolocation
 *   : `2` - Position unavailable
 *   : `3` - Timeout - geolocation request took too long;
 * - data `GeolocationData|null` - Location data object or null
 *   : latitude `number` - The latitude in decimal degrees
 *   : longitude `number` - The longitude in decimal degrees
 *   : accuracy `number` - The accuracy of position in meters
 *   : altitude `number|null` - The altitude in meters above the WGS84 ellipsoid
 *   : altitudeAccuracy `number|null` - The altitude accuracy in meters
 *   : heading `number|null` - The heading in degrees clockwise from true north
 *   : speed `number|null` - The speed in meters per second
 *   : timestamp `number` - The time when the position was retrieved;
 * - getCurrentPosition `Function` - Function to get the current position once;
 * - startTracking `Function` - Function to start tracking location changes;
 * - stopTracking `Function` - Function to stop tracking location;
 * - isTracking `boolean` - Whether location tracking is currently active;
 *
 * @example
 * // Basic usage
 * const {
 *   loading,
 *   error,
 *   data,
 *   getCurrentPosition
 * } = useGeolocation();
 *
 * // Automatically fetch location when component mounts
 * const {
 *   loading,
 *   error,
 *   data
 * } = useGeolocation({ mountBehavior: 'get' });
 *
 * // Location tracking
 * const {
 *   loading,
 *   error,
 *   data,
 *   startTracking,
 *   stopTracking,
 *   isTracking
 * } = useGeolocation();
 *
 * const handleStartTracking = () => {
 *   startTracking();
 * };
 *
 * const handleStopTracking = () => {
 *   stopTracking();
 * };
 */
export function useGeolocation(options?: GeolocationOptions) {
  const [state, setState] = useState<{
    loading: boolean;
    error: CustomGeoLocationError | null;
    data: GeolocationData | null;
  }>({
    loading: !!options?.mountBehavior,
    error: null,
    data: null,
  });
  const [isTracking, setIsTracking] = useState(false);

  const watchIdRef = useRef<number | null>(null);

  const checkGeolocationSupport = useCallback(() => {
    if (typeof window === 'undefined' || navigator.geolocation === undefined) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: new CustomGeoLocationError({
          code: 0,
          message: 'Geolocation is not supported by this environment.',
        }),
      }));

      return false;
    }

    return true;
  }, []);

  const handleSuccess = useCallback((position: GeolocationPosition) => {
    const { coords } = position;

    setState(prev => ({
      ...prev,
      loading: false,
      error: null,
      data: {
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
        altitude: coords.altitude,
        altitudeAccuracy: coords.altitudeAccuracy,
        heading: coords.heading,
        speed: coords.speed,
        timestamp: position.timestamp,
      },
    }));
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    const { code, message } = error;
    setState(prev => ({
      ...prev,
      loading: false,
      error: new CustomGeoLocationError({ code, message }),
    }));
  }, []);

  const getGeolocationOptions = useCallback(
    () => ({
      enableHighAccuracy: options?.enableHighAccuracy,
      maximumAge: options?.maximumAge,
      timeout: options?.timeout,
    }),
    [options?.enableHighAccuracy, options?.maximumAge, options?.timeout]
  );

  const getCurrentPosition = useCallback(() => {
    if (!checkGeolocationSupport()) {
      return;
    }

    setState(prev => ({ ...prev, loading: true }));

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, getGeolocationOptions());
  }, [handleSuccess, handleError, getGeolocationOptions, checkGeolocationSupport]);

  const startTracking = useCallback(() => {
    if (!checkGeolocationSupport()) {
      return;
    }

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    setState(prev => ({ ...prev, loading: true }));

    watchIdRef.current = navigator.geolocation.watchPosition(
      position => {
        setIsTracking(true);
        handleSuccess(position);
      },
      handleError,
      getGeolocationOptions()
    );
  }, [handleSuccess, handleError, getGeolocationOptions, checkGeolocationSupport]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current === null) {
      return;
    }

    navigator.geolocation.clearWatch(watchIdRef.current);
    watchIdRef.current = null;
    setIsTracking(false);
  }, []);

  useEffect(() => {
    if (options?.mountBehavior === GeolocationMountBehavior.WATCH) {
      startTracking();
    } else if (options?.mountBehavior === GeolocationMountBehavior.GET) {
      getCurrentPosition();
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [options?.mountBehavior, getCurrentPosition, startTracking]);

  return {
    ...state,
    getCurrentPosition,
    startTracking,
    stopTracking,
    isTracking,
  };
}
