import type { NavigatorWithUserAgentData } from './types.ts';

/**
 * Tests a regular expression against `navigator.userAgentData.platform` when
 * available, otherwise against the legacy `navigator.platform` string.
 */
export function testPlatform(re: RegExp): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const navigatorWithHints = window.navigator as NavigatorWithUserAgentData;
  const platform = navigatorWithHints.userAgentData?.platform ?? window.navigator.platform;

  return re.test(platform);
}
