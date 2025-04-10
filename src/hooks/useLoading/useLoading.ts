import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * @description
 * `useLoading` is a React hook that simplifies managing the loading state of a `Promise`.
 * It provides a state to track whether an asynchronous operation is in progress and a function to handle the loading state automatically.
 *
 * @returns {[loading: boolean, startLoading: <T>(promise: Promise<T>) => Promise<T>]} A tuple containing:
 * - loading `boolean` - Represents the current loading state.
 *    : The initial value is `false`.
 *    : It is set to `true` when an asynchronous task is in progress;
 *
 * - startLoading `<T>(promise: Promise<T>) => Promise<T>` - A function that executes asynchronous tasks while managing the loading state.
 *    : This function takes a `Promise` as an argument and automatically resets the `isLoading` state to `false` when the `Promise` completes;
 *
 * @example
 * function ConfirmButton() {
 *   const [loading, startLoading] = useLoading();
 *
 *   const handleSubmit = useCallback(async () => {
 *     try {
 *       const result = await startLoading(postConfirmation());
 *       router.push(`/success?id=${result.id}`);
 *     } catch (error) {
 *       console.error('Error:', error);
 *     }
 *   }, [startLoading]);
 *
 *   return (
 *     <button disabled={loading} onClick={handleSubmit}>
 *       {loading ? 'Loading...' : 'Confirm'}
 *     </button>
 *   );
 * }
 */
export function useLoading(): [boolean, <T>(promise: Promise<T>) => Promise<T>] {
  const [loading, setLoading] = useState(false);
  const ref = useIsMountedRef();

  const startTransition = useCallback(
    async <T>(promise: Promise<T>) => {
      try {
        setLoading(true);
        const data = await promise;
        return data;
      } finally {
        if (ref.isMounted) {
          setLoading(false);
        }
      }
    },
    [ref.isMounted]
  );

  return useMemo(() => [loading, startTransition], [loading, startTransition]);
}

function useIsMountedRef() {
  const ref = useRef({ isMounted: true }).current;

  useEffect(() => {
    ref.isMounted = true;
    return () => {
      ref.isMounted = false;
    };
  }, [ref]);

  return ref;
}
