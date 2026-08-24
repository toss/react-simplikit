import { useCallback, useMemo, useRef } from 'react';

type AsyncLockResult<T> = { status: 'executed'; data: T } | { status: 'blocked' };

type UseAsyncLockReturn = {
  runWithLock: <T>(callback: () => Promise<T> | T) => Promise<AsyncLockResult<T>>;
  isLocked: () => boolean;
};

/**
 * @description
 * `useAsyncLock` is a React hook that prevents overlapping execution of asynchronous work.
 * While one callback is running, additional calls are skipped and return a blocked result.
 *
 * @returns {UseAsyncLockReturn} An object containing:
 * - runWithLock `<T>(callback: () => Promise<T> | T) => Promise<AsyncLockResult<T>>` - Runs a callback only when the lock is available.
 * - isLocked `() => boolean` - Returns whether the lock is currently held.
 *
 * @example
 * const { runWithLock } = useAsyncLock();
 *
 * async function handleSubmit() {
 *   const result = await runWithLock(async () => {
 *     return submitForm();
 *   });
 *
 *   if (result.status === 'blocked') {
 *     return;
 *   }
 *
 *   console.log(result.data);
 * }
 */
export function useAsyncLock(): UseAsyncLockReturn {
  const isLockedRef = useRef(false);

  const runWithLock = useCallback(async function runWithLock<T>(
    callback: () => Promise<T> | T
  ): Promise<AsyncLockResult<T>> {
    if (isLockedRef.current) {
      return { status: 'blocked' };
    }

    isLockedRef.current = true;

    try {
      const data = await callback();
      return { status: 'executed', data };
    } finally {
      isLockedRef.current = false;
    }
  }, []);

  const isLocked = useCallback(function isLocked() {
    return isLockedRef.current;
  }, []);

  return useMemo(() => ({ runWithLock, isLocked }), [runWithLock, isLocked]);
}
