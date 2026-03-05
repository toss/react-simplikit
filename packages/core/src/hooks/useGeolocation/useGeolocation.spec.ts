import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderHookSSR } from '../../_internal/test-utils/renderHookSSR.tsx';

import { CustomGeoLocationError, useGeolocation } from './useGeolocation.ts';

const mockGeolocation = {
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn(),
  clearWatch: vi.fn(),
};

const mockPosition = {
  coords: {
    latitude: 37.5326,
    longitude: 127.0246,
    accuracy: 10,
    altitude: 100,
    altitudeAccuracy: 10,
    heading: 90,
    speed: 5,
  },
  timestamp: Date.now(),
} as GeolocationPosition;

beforeEach(() => {
  vi.clearAllMocks();

  Object.defineProperty(global.navigator, 'geolocation', {
    value: mockGeolocation,
    writable: true,
  });
});

describe('useGeolocation', () => {
  it('should retrieve location data when getCurrentPosition is called', async () => {
    let successCallback: PositionCallback;

    mockGeolocation.getCurrentPosition.mockImplementation(success => {
      successCallback = success;
    });

    const { result } = renderHookSSR(() => useGeolocation());

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();

    await act(async () => {
      result.current.getCurrentPosition();
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      successCallback(mockPosition);
    });

    expect(result.current.data).toEqual({
      latitude: mockPosition.coords.latitude,
      longitude: mockPosition.coords.longitude,
      accuracy: mockPosition.coords.accuracy,
      altitude: mockPosition.coords.altitude,
      altitudeAccuracy: mockPosition.coords.altitudeAccuracy,
      heading: mockPosition.coords.heading,
      speed: mockPosition.coords.speed,
      timestamp: mockPosition.timestamp,
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should return appropriate error and terminate function calls when used in unsupported environments', async () => {
    Object.defineProperty(global.navigator, 'geolocation', { value: undefined });

    const { result } = renderHookSSR(() => useGeolocation({ mountBehavior: 'get' }));

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();

    const customError = result.current.error as CustomGeoLocationError;

    expect(customError.code).toBe(0);
    expect(customError.message).toBe('Geolocation is not supported by this environment.');
    expect(customError.name).toBe('CustomGeoLocationError');

    vi.clearAllMocks();

    await act(async () => {
      result.current.startTracking();
    });

    expect(mockGeolocation.watchPosition).not.toHaveBeenCalled();
    expect(result.current.error?.code).toBe(0);
    expect(result.current.error?.message).toBe('Geolocation is not supported by this environment.');
    expect(customError.name).toBe('CustomGeoLocationError');

    await act(async () => {
      result.current.stopTracking();
    });

    expect(mockGeolocation.clearWatch).not.toHaveBeenCalled();
  });

  it('should update error state when getCurrentPosition call fails', async () => {
    const mockPositionError = {
      code: 1,
      message: 'User denied Geolocation',
    };

    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error(mockPositionError);
    });

    const { result } = renderHookSSR(() => useGeolocation());

    await act(async () => {
      result.current.getCurrentPosition();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).not.toBeNull();
    expect(result.current.error).toBeInstanceOf(Error);

    const customError = result.current.error as CustomGeoLocationError;

    expect(customError.code).toBe(1);
    expect(customError.message).toBe('User denied Geolocation');
    expect(customError.name).toBe('CustomGeoLocationError');
  });

  it('should automatically call getCurrentPosition on mount when mountBehavior option is "get"', () => {
    mockGeolocation.getCurrentPosition.mockImplementation(() => {});

    const { result } = renderHookSSR(() => useGeolocation({ mountBehavior: 'get' }));

    expect(result.current.loading).toBe(true);
    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      expect.objectContaining({})
    );
  });

  it('should automatically call startTracking on mount when mountBehavior is "watch"', () => {
    mockGeolocation.watchPosition.mockImplementation(() => {});

    const { result } = renderHookSSR(() => useGeolocation({ mountBehavior: 'watch' }));

    expect(result.current.loading).toBe(true);
    expect(mockGeolocation.watchPosition).toHaveBeenCalledTimes(1);
    expect(mockGeolocation.watchPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      expect.objectContaining({})
    );
  });

  it('should not automatically request location when mountBehavior option is not provided', () => {
    const { result } = renderHookSSR(() => useGeolocation());

    expect(result.current.loading).toBe(false);
    expect(mockGeolocation.getCurrentPosition).not.toHaveBeenCalled();
    expect(mockGeolocation.watchPosition).not.toHaveBeenCalled();
  });

  it('should correctly pass geolocation options', () => {
    const options = {
      mountBehavior: 'get' as const,
      enableHighAccuracy: true,
      maximumAge: 1000,
      timeout: 5000,
    };

    renderHookSSR(() => useGeolocation(options));

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      expect.objectContaining({
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000,
      })
    );
  });

  it('should return updated location data when position changes during tracking', async () => {
    const updatedPosition = {
      coords: {
        latitude: 37.5665,
        longitude: 126.978,
        accuracy: 15,
        altitude: 120,
        altitudeAccuracy: 15,
        heading: 180,
        speed: 10,
      },
      timestamp: Date.now() + 1000,
    } as GeolocationPosition;

    let watchCallback: PositionCallback;
    mockGeolocation.watchPosition.mockImplementation(success => {
      watchCallback = success;
      return 123;
    });

    const { result } = renderHookSSR(() => useGeolocation());

    await act(async () => {
      result.current.startTracking();
    });

    await act(async () => {
      watchCallback(mockPosition);
    });

    expect(result.current.data).toEqual({
      latitude: mockPosition.coords.latitude,
      longitude: mockPosition.coords.longitude,
      accuracy: mockPosition.coords.accuracy,
      altitude: mockPosition.coords.altitude,
      altitudeAccuracy: mockPosition.coords.altitudeAccuracy,
      heading: mockPosition.coords.heading,
      speed: mockPosition.coords.speed,
      timestamp: mockPosition.timestamp,
    });

    await act(async () => {
      watchCallback(updatedPosition);
    });

    expect(result.current.data).toEqual({
      latitude: updatedPosition.coords.latitude,
      longitude: updatedPosition.coords.longitude,
      accuracy: updatedPosition.coords.accuracy,
      altitude: updatedPosition.coords.altitude,
      altitudeAccuracy: updatedPosition.coords.altitudeAccuracy,
      heading: updatedPosition.coords.heading,
      speed: updatedPosition.coords.speed,
      timestamp: updatedPosition.timestamp,
    });
  });

  it('should call clearWatch if watchId already exists when startTracking is called', async () => {
    mockGeolocation.watchPosition.mockReturnValue(123);

    const { result } = renderHookSSR(() => useGeolocation());

    await act(async () => {
      result.current.startTracking();
    });

    expect(mockGeolocation.clearWatch).not.toHaveBeenCalled();

    await act(async () => {
      result.current.startTracking();
    });

    expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(123);
  });

  it('should properly update isTracking state when starting and stopping location tracking', async () => {
    let watchPositionCallback: PositionCallback;

    mockGeolocation.watchPosition.mockImplementation(success => {
      watchPositionCallback = success;

      return 123;
    });

    const { result } = renderHookSSR(() => useGeolocation());

    expect(result.current.isTracking).toBe(false);

    await act(async () => {
      result.current.startTracking();
    });

    await act(async () => {
      watchPositionCallback(mockPosition);
    });

    expect(result.current.isTracking).toBe(true);
    expect(mockGeolocation.watchPosition).toHaveBeenCalledTimes(1);

    await act(async () => {
      result.current.stopTracking();
    });

    expect(result.current.isTracking).toBe(false);
    expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(123);
  });

  it('should clean up watchPosition when component unmounts', async () => {
    mockGeolocation.watchPosition.mockReturnValue(123);

    const { result, unmount } = renderHookSSR(() => useGeolocation());

    await act(async () => {
      result.current.startTracking();
    });

    unmount();

    expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(123);
  });
});
