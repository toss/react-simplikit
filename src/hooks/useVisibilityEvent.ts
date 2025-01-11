import { useCallback, useEffect } from 'react';

type Options = {
  immediate?: boolean;
};

/**
 * A React hook that listens to changes in the document's visibility state and triggers a callback.
 *
 * @param {function} callback - A function to be called when the visibility state changes.
 * It receives the current visibility state ('visible' or 'hidden') as an argument.
 * @param {Object} [options] - Optional configuration for the hook.
 * @param {boolean} [options.immediate=false] - If true, the callback is invoked immediately upon mounting
 * with the current visibility state.
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
