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
 * @description
 * `useNetworkStatus` is a React hook that provides access to the Network Information API.
 * It provides raw network connection data such as the connection type, quality, speed and the user's
 * data saver preference. Every property is `undefined` if the API is not supported (e.g., Safari, Firefox).
 *
 * @returns {NetworkStatus} Network status information
 * - effectiveType `'slow-2g' | '2g' | '3g' | '4g' | undefined` - Connection quality, or `undefined` if the API is not supported
 * - type `'bluetooth' | 'cellular' | 'ethernet' | 'mixed' | 'none' | 'other' | 'unknown' | 'wifi' | 'wimax' | undefined` - Physical connection type, or `undefined` if the API is not supported
 * - downlink `number | undefined` - Downlink speed in Mbps, or `undefined` if the API is not supported
 * - rtt `number | undefined` - Round-trip time in milliseconds, or `undefined` if the API is not supported
 * - saveData `boolean | undefined` - User's data saver preference, or `undefined` if the API is not supported
 *
 * @example
 * <caption>Adaptive image quality</caption>
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
 *
 * @example
 * <caption>Conditional video autoplay</caption>
 * function VideoPlayer() {
 *   const { type, downlink } = useNetworkStatus();
 *
 *   // Custom logic: only autoplay on wifi with good bandwidth
 *   const shouldAutoplay = type === 'wifi' && (downlink ?? 0) > 5;
 *
 *   return <video src="video.mp4" autoPlay={shouldAutoplay} />;
 * }
 *
 * @remarks
 * ### Browser support
 *
 * - **Chrome/Edge (Android)**: every property is supported
 * - **Chrome/Edge (Desktop)**: partial support (`effectiveType`, `downlink`, `rtt` and `saveData` are available; `type` may be `undefined`)
 * - **Firefox**: not supported (every property is `undefined`)
 * - **Safari**: not supported (every property is `undefined`)
 *
 * ### SSR safety
 *
 * The hook is safe during server-side rendering. On the server it returns an empty object `{}` and it subscribes to network changes only in the browser.
 *
 * ### Recommendations
 *
 * - Always check for `undefined` before using a value, since the API is not available in every browser
 * - Provide a fallback for browsers without the Network Information API
 * - Use the hook to enhance the experience rather than for essential features
 * - Consider `effectiveType` together with `saveData` when deciding what to deliver
 *
 * ### References
 *
 * - [Network Information API specification](https://wicg.github.io/netinfo/)
 * - [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)
 *
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
