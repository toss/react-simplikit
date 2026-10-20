import type { NavigatorWithUserAgentData } from './types.ts';

/**
 * Tests a regular expression against Client Hints brand list when available,
 * otherwise against `navigator.userAgent`.
 *
 * Brand matching is useful for browser engines (Chrome, Firefox, …).
 * Platform tokens such as "Android" usually appear only in the UA string.
 */
export function testUserAgent(re: RegExp): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const navigatorWithHints = window.navigator as NavigatorWithUserAgentData;
  const brands = navigatorWithHints.userAgentData?.brands;

  if (Array.isArray(brands) && brands.some(brand => re.test(brand.brand))) {
    return true;
  }

  return re.test(window.navigator.userAgent);
}
