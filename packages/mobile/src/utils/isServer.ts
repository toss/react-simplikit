/**
 * @description Check if the code is running on the server.
 *
 * @returns {boolean} true if running in a server environment (SSR), false otherwise.
 *
 * @example
 * ```ts
 * if (isServer()) {
 *   // SSR-safe code
 *   return null;
 * }
 *
 * // Client-only code
 * window.addEventListener('resize', handleResize);
 * ```
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}
