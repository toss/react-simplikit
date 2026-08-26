import { useCallback, useEffect } from 'react';

type Options = {
  immediate?: boolean;
};

/**
 * @deprecated This hook is deprecated as it depends on browser-specific APIs (document.visibilityState).
 * react-simplikit is now focused on platform-independent, pure state/logic hooks.
 * This hook will be removed in a future major version.
 *
 * @description
 * `useVisibilityEvent` is a React hook that listens to changes in the document's visibility state and triggers a callback.
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

export function useVisibilityEvent(callback: (visibilityState: 'visible' | 'hidden') => void, options: Options = {}) {
  const handleVisibilityChange = useCallback(() => {
    callback(document.visibilityState);
  }, [callback]);

  useEffect(() => {
    if (options?.immediate ?? false) {
      handleVisibilityChange();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange, options?.immediate]);
}
