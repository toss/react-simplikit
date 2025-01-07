import { DependencyList, useEffect, useRef, useMemo } from 'react';

/**
 * @description
 * useAsyncEffect is a hook for handling async effects in React components.
 * Follows the same cleanup pattern as useEffect.
 *
 * @example
 * useAsyncEffect(async () => {
 *   const data = await fetchData();
 *   setData(data);
 *
 *   return () => {
 *     // cleanup logic
 *   };
 * }, [dependency]);
 */

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (a && b && typeof a === 'object' && typeof b === 'object') {
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((item, index) => deepEqual(item, b[index]));
    }

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    return keysA.every(key => Object.prototype.hasOwnProperty.call(b, key) && deepEqual(a[key], b[key]));
  }

  return false;
}

export function useAsyncEffect(effect: () => Promise<void | (() => void)>, deps?: DependencyList) {
  const memoizedDeps = useCompareDeps(deps);
  useEffect(
    () => {
      console.log('fired');
      let cleanup: (() => void) | void;

      effect().then(result => {
        cleanup = result;
      });

      return () => {
        cleanup?.();
      };

      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    memoizedDeps === undefined ? undefined : [memoizedDeps]
  );
}

function useCompareDeps<T>(value: T) {
  const ref = useRef<T>(value);
  const signalRef = useRef<number>(0);

  console.log(deepEqual(value, ref.current), value, ref.current);

  if (value === undefined && ref.current === undefined) {
    signalRef.current += 1;
  }

  if (!deepEqual(value, ref.current)) {
    ref.current = value;
    signalRef.current += 1;
  }

  return useMemo(() => ref.current, [signalRef.current]);
}
