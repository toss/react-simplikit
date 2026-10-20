import { testPlatform } from '../../_internal/platform/testPlatform.ts';
import { testUserAgent } from '../../_internal/platform/testUserAgent.ts';
import { isServer } from '../isServer/index.ts';

/**
 * @description
 * `isAndroid` is a utility function that detects whether the current device is running Android.
 *
 * Detection prefers the User-Agent Client Hints API (`navigator.userAgentData.platform`)
 * and falls back to matching `"Android"` in Client Hints brands or `navigator.userAgent`.
 *
 * Notes:
 * - All Android browsers include the token "Android" in the user agent.
 * - Chromium on Android typically exposes Client Hints `platform` as `"Android"`.
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

  if (userAgent !== undefined) {
    return /Android/i.test(userAgent);
  }

  return testPlatform(/^Android/i) || testUserAgent(/Android/i);
}
