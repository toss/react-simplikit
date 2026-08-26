/**
 * @description
 * `isServer` is a utility function that checks if the code is running on the server.
 * It returns `true` in SSR (Server-Side Rendering) environments where `window` is undefined,
 * and `false` in client-side environments.
 *
 * @returns {boolean} `true` if running in a server environment (SSR), `false` otherwise.
 *
 * @example
 * if (isServer()) {
 *   // SSR-safe code
 *   return null;
 * }
 *
 * // Client-only code
 * window.addEventListener('resize', handleResize);
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}
