import { usePageVisibilityEffect } from '../usePageVisibilityEffect/index.ts';

/**
 * @deprecated Use `usePageVisibilityEffect` instead.
 *
 * @description
 * `useVisibilityEvent` is a React hook that listens to changes in the document's visibility state and triggers a callback.
 *
 * @see `usePageVisibility` returns the visibility as state instead of running a callback.
 *
 * @param {(visibilityState: 'visible' | 'hidden') => void} callback - A function to be called
 * when the visibility state changes. It receives the current visibility state ('visible' or 'hidden') as an argument.
 * @param {object} [options] - Optional configuration for the hook.
 * @param {boolean} [options.immediate=false] - If true, the callback is invoked immediately upon mounting
 * with the current visibility state.
 *
 * @example
 * import { useVisibilityEvent } from 'react-simplikit';
 *
 * function Component() {
 *   useVisibilityEvent(visibilityState => {
 *     console.log(`Document is now ${visibilityState}`);
 *   });
 *
 *   return <p>Check the console for visibility changes.</p>;
 * }
 */
export const useVisibilityEvent = usePageVisibilityEffect;
