/**
 * @description
 * `useIsBrowser` is a React hook that detects whether the code is running in a browser environment.
 * 
 * This is useful for conditionally running code that should only execute in a browser,
 * such as accessing the `window` or `document` objects.
 * 
 * @returns {boolean} `true` if running in a browser environment, `false` if running in a server environment.
 * 
 * @example
 * import { useIsBrowser } from 'react-simplikit';
 * 
 * function Component() {
 *   const isBrowser = useIsBrowser();
 * 
 *   return (
 *     <div>
 *       <p>Running in: {isBrowser ? 'Browser' : 'Server'}</p>
 *       {isBrowser && <p>This content only renders in the browser</p>}
 *     </div>
 *   );
 * }
 */
export function useIsBrowser(): boolean {
  return typeof window !== 'undefined';
}
