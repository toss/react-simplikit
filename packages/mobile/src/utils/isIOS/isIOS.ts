import { isServer } from '../isServer/index.ts';

/**
 * @description
 * `isIOS` is a utility function that detects whether the current device is running iOS or iPadOS.
 *
 * Notes on platform inconsistencies:
 * - Prior to iPadOS 13, iPads reported their platform as "iPad" (or matched /iPad/ in UA).
 * - Starting from iPadOS 13, Apple changed the platform string to "MacIntel"
 *   to make websites treat iPadOS as desktop-class Safari.
 *   However, these devices still expose multi-touch capabilities.
 *
 * @param {string} [userAgent] - Optional user agent string to check. Defaults to `navigator.userAgent`.
 *
 * @returns {boolean} `true` if the device is running iOS or iPadOS, `false` otherwise.
 * Returns `false` on server-side rendering environments.
 *
 * @example
 * if (isIOS()) {
 *   // iOS-specific code
 *   enableIOSOptimizations();
 * }
 *
 * @example
 * // With custom user agent
 * const isIOSDevice = isIOS('Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)');
 */
export function isIOS(userAgent?: string): boolean {
  if (isServer()) {
    return false;
  }

  const ua = userAgent ?? navigator.userAgent;
  const platform = navigator.platform;
  const maxTouchPoints = navigator.maxTouchPoints;

  const matchesClassicIOS = /iPhone|iPad|iPod/i.test(ua);
  const matchesModernIPad = platform === 'MacIntel' && typeof maxTouchPoints === 'number' && maxTouchPoints > 1;

  return matchesClassicIOS || matchesModernIPad;
}
