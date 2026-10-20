/**
 * Minimal typings for the User-Agent Client Hints API.
 * TypeScript's bundled DOM lib does not include these yet in this project.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData
 */
export type NavigatorUABrandVersion = {
  brand: string;
  version: string;
};

export type NavigatorUAData = {
  brands: NavigatorUABrandVersion[];
  mobile: boolean;
  platform: string;
};

export type NavigatorWithUserAgentData = Navigator & {
  userAgentData?: NavigatorUAData;
};
