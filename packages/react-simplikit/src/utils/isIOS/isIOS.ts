import { testPlatform } from '../../_internal/platform/testPlatform.ts';
import { testUserAgent } from '../../_internal/platform/testUserAgent.ts';
import { isServer } from '../isServer/index.ts';

/**
 * @description
 * `isIOS` is a utility function that detects whether the current device is running iOS or iPadOS.
 *
 * Detection prefers the User-Agent Client Hints API (`navigator.userAgentData.platform`)
 * and falls back to the legacy `navigator.platform` / `navigator.userAgent` strings.
 *
 * Notes on platform inconsistencies:
 * - Prior to iPadOS 13, iPads reported their platform as "iPad" (or matched /iPad/ in UA).
 * - Starting from iPadOS 13, Apple changed the platform string to "MacIntel"
 *   to make websites treat iPadOS as desktop-class Safari.
 *   However, these devices still expose multi-touch capabilities.
 * - Chromium-based browsers may report Client Hints `platform` as `"iOS"` instead of `"iPhone"`.
 *
 * @param {string} [userAgent] - Optional user agent string to check. Defaults to `navigator.userAgent`.
 *   When provided, the string is matched directly; the modern iPadOS heuristic still uses the live
 *   platform and touch APIs so desktop-class iPad Safari can be detected.
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

  const matchesModernIPad =
    testPlatform(/^Mac/i) && typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 1;

  if (userAgent !== undefined) {
    const matchesClassicIOS = /iPhone|iPad|iPod/i.test(userAgent);
    return matchesClassicIOS || matchesModernIPad;
  }

  const matchesClientHintsIOS = testPlatform(/^(iPhone|iPad|iPod|iOS)/i);
  const matchesClassicIOS = testUserAgent(/iPhone|iPad|iPod/i);

  return matchesClientHintsIOS || matchesClassicIOS || matchesModernIPad;
}
