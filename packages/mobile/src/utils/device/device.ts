import { isServer } from '../isServer.ts';

/**
 * Detects whether the current device is running iOS or iPadOS.
 *
 * Notes on platform inconsistencies:
 * - Prior to iPadOS 13, iPads reported their platform as "iPad" (or matched /iPad/ in UA).
 * - Starting from iPadOS 13, Apple changed the platform string to "MacIntel"
 *   to make websites treat iPadOS as desktop-class Safari.
 *   However, these devices still expose multi-touch capabilities.
 *
 * @returns `false` on server-side rendering environments.
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

/**
 * Detects whether the current device is running Android.
 *
 * Notes:
 * - All Android browsers include the token "Android" in the user agent.
 *
 * @returns `false` on server-side rendering environments.
 */
export function isAndroid(userAgent?: string): boolean {
  if (isServer()) {
    return false;
  }

  const ua = userAgent ?? navigator.userAgent;
  return /Android/i.test(ua);
}
