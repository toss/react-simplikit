import { useCallbackOnce } from '../useCallbackOnce/index.ts';

/**
 * @deprecated Use `useCallbackOnce` instead.
 *
 * @description
 * `useCallbackOncePerRender` is a React hook that runs a callback only once until `deps` change, no matter how many times the returned function is called.
 *  This is useful for one-time operations that should not be repeated, even if the component re-renders.
 *
 * @template {(...args: any[]) => void} F - The type of the callback function.
 * @param {F} callback - The callback function to be executed once. It receives the arguments passed to the returned function.
 * @param {DependencyList} deps - Dependencies array. When it changes, the returned function can run the callback once more.
 *
 * @returns {(...args: Parameters<F>) => void} A function whose reference never changes. It runs the callback only once until `deps` change.
 *
 * @example
 * import { useCallbackOncePerRender } from 'react-simplikit';
 *
 * function Component() {
 *   const handleOneTimeEvent = useCallbackOncePerRender(() => {
 *     console.log('This will only run once');
 *   }, []);
 *
 *   return <button onClick={handleOneTimeEvent}>Click me</button>;
 * }
 *
 * @example
 * // With dependencies
 * function TrackingComponent({ userId }: { userId: string }) {
 *   const trackUserVisit = useCallbackOncePerRender(() => {
 *     analytics.trackVisit(userId);
 *   }, [userId]);
 *
 *   useEffect(() => {
 *     trackUserVisit();
 *   }, [trackUserVisit, userId]);
 *
 *   return <div>User page</div>;
 * }
 */
export const useCallbackOncePerRender = useCallbackOnce;
