import { isServer } from '../isServer/index.ts';

/**
 * @description
 * `isAndroid` is a utility function that detects whether the current device is running Android.
 *
 * Notes:
 * - All Android browsers include the token "Android" in the user agent.
 *
 * @param {string} [userAgent] - Optional user agent string to check. Defaults to `navigator.userAgent`.
 *
 * @returns {boolean} `true` if the device is running Android, `false` otherwise.
 * Returns `false` on server-side rendering environments.
 *
 * @example
 * if (isAndroid()) {
 *   // Android-specific code
 *   enableAndroidOptimizations();
 * }
 *
 * @example
 * // With custom user agent
 * const isAndroidDevice = isAndroid('Mozilla/5.0 (Linux; Android 12; Pixel 6) Chrome/120');
 */
export function isAndroid(userAgent?: string): boolean {
  if (isServer()) {
    return false;
  }

  const ua = userAgent ?? navigator.userAgent;
  return /Android/i.test(ua);
}
