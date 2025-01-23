import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 *
 *
 *
 * @description
 * `useLoading` is a React hook that helps manage the loading state of a `Promise` easily. It provides a state to check whether an asynchronous operation is in progress, along with functions to handle the loading state.
 *
 * @returns The function returns a tuple of the form `[boolean, <T>(promise: Promise<T>) => Promise<T>]`:
 *
 * 1. `boolean`: Represents the current loading state.
 *
 * - The initial value is `false`.
 * - It is set to `true` when an asynchronous task is in progress.
 *
 * 2. `<T>(promise: Promise<T>) => Promise<T>`: This is a function that executes asynchronous tasks while managing the loading state.
 *
 * - This function takes a `Promise` as an argument and sets the `isLoading` state to `false` when the `Promise` is completed.
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
 *   }, [startLoading, data]);
 *
 *     <button disabled={loading} onClick={handleSubmit}>
 *       {loading ? 'loading...' : 'Confirm'}
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
