import { useEffect, useState } from 'react';

import { isServer } from '../../utils/isServer/index.ts';

/**
 * Effective connection type based on Network Information API
 * @see https://wicg.github.io/netinfo/#effective-connection-types
 */
export type EffectiveConnectionType = 'slow-2g' | '2g' | '3g' | '4g';

/**
 * Physical connection type
 * @see https://wicg.github.io/netinfo/#dom-connectiontype
 */
export type ConnectionType =
  | 'bluetooth'
  | 'cellular'
  | 'ethernet'
  | 'mixed'
  | 'none'
  | 'other'
  | 'unknown'
  | 'wifi'
  | 'wimax';

/**
 * Network status information from Network Information API
 */
export type NetworkStatus = {
  /** Effective connection type (4g, 3g, 2g, slow-2g) - undefined if API not supported */
  effectiveType?: EffectiveConnectionType;
  /** Physical connection type (wifi, cellular, etc.) - undefined if API not supported */
  type?: ConnectionType;
  /** Downlink speed in Mbps - undefined if API not supported */
  downlink?: number;
  /** Round-trip time in milliseconds - undefined if API not supported */
  rtt?: number;
  /** User's data saver preference - undefined if API not supported */
  saveData?: boolean;
};

type NetworkInformation = {
  effectiveType?: EffectiveConnectionType;
  type?: ConnectionType;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  addEventListener(type: 'change', listener: () => void): void;
  removeEventListener(type: 'change', listener: () => void): void;
} & EventTarget;

type NavigatorWithConnection = {
  connection?: NetworkInformation;
} & Navigator;

/**
 * React hook to access Network Information API
 *
 * Provides raw network connection data. Returns undefined for all properties
 * if the API is not supported (e.g., Safari, Firefox).
 *
 * **Browser Support**:
 * - Chrome/Edge (Android): Full support
 * - Chrome/Edge (Desktop): Partial support (effectiveType, downlink, rtt, saveData)
 * - Firefox: Not supported
 * - Safari: Not supported
 *
 * @returns {NetworkStatus} Network status information
 * - `effectiveType` - Connection quality: 'slow-2g' | '2g' | '3g' | '4g'
 * - `type` - Physical connection: 'wifi' | 'cellular' | 'ethernet' | etc.
 * - `downlink` - Downlink speed in Mbps
 * - `rtt` - Round-trip time in milliseconds
 * - `saveData` - User's data saver preference
 *
 * @example
 * ```tsx
 * function AdaptiveImage() {
 *   const { effectiveType, saveData } = useNetworkStatus();
 *
 *   // Determine quality based on your app's needs
 *   const useHighQuality = effectiveType === '4g' && !saveData;
 *
 *   return (
 *     <img
 *       src={useHighQuality ? 'high-res.jpg' : 'low-res.jpg'}
 *       alt="Content"
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * function VideoPlayer() {
 *   const { type, downlink } = useNetworkStatus();
 *
 *   // Custom logic: only autoplay on wifi with good bandwidth
 *   const shouldAutoplay = type === 'wifi' && (downlink ?? 0) > 5;
 *
 *   return <video src="video.mp4" autoPlay={shouldAutoplay} />;
 * }
 * ```
 *
 * @see https://wicg.github.io/netinfo/
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API
 */
export function useNetworkStatus(): NetworkStatus {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>(getNetworkStatus);

  useEffect(function subscribeToNetworkChanges() {
    if (isServer()) {
      return;
    }

    const connection = getNavigatorConnection();

    if (connection == null) {
      return;
    }

    function updateNetworkStatus() {
      setNetworkStatus(getNetworkStatus());
    }

    connection.addEventListener('change', updateNetworkStatus);

    return function cleanup() {
      connection.removeEventListener('change', updateNetworkStatus);
    };
  }, []);

  return networkStatus;
}

function getNavigatorConnection(): NetworkInformation | null {
  if (isServer() || !('connection' in navigator)) {
    return null;
  }

  try {
    return (navigator as NavigatorWithConnection).connection ?? null;
  } catch {
    return null;
  }
}

function getNetworkStatus(): NetworkStatus {
  const connection = getNavigatorConnection();

  if (connection == null) {
    return {};
  }

  return {
    effectiveType: connection.effectiveType,
    type: connection.type,
    downlink: connection.downlink,
    rtt: connection.rtt,
    saveData: connection.saveData,
  };
}
