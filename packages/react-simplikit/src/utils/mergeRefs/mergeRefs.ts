import { RefCallback, RefObject } from 'react';

/**
 * @description
 * This function takes multiple refs (RefObject or RefCallback) and returns a single ref that updates all provided refs.
 * It's useful when you need to pass multiple refs to a single element.
 * When a callback ref returns a cleanup function (React 19), the merged ref returns one as well and runs every cleanup on detach.
 *
 * @template T - The type of target to be referenced.
 *
 * @param {...Array<RefObject<T> | RefCallback<T> | null | undefined>} refs - An array of refs to be merged. Each ref can be either a RefObject or RefCallback.
 *
 * @returns {RefCallback<T>} A single ref callback that updates all provided refs.
 *
 * @example
 * forwardRef(function Component(props, parentRef) {
 *   const myRef = useRef(null);
 *
 *   return <div ref={mergeRefs(myRef, parentRef)} />;
 * })
 *
 * @example
 * function Component(props) {
 *   const ref = useRef(null);
 *   const [height, setHeight] = useState(0);
 *
 *   const measuredRef = useCallback(node => {
 *     if(node == null) {
 *       return;
 *     }
 *
 *     setHeight(node.offsetHeight);
 *   }, []);
 *
 *   return <div ref={mergeRefs(measuredRef, ref)} />;
 * }
 */
export function mergeRefs<T>(...refs: Array<RefObject<T> | RefCallback<T> | null | undefined>): RefCallback<T> {
  return value => {
    let hasCleanup = false;

    const cleanups = refs.map(ref => {
      if (ref == null) {
        return undefined;
      }

      const cleanup = setRef(ref, value);

      if (typeof cleanup === 'function') {
        hasCleanup = true;
      }

      return cleanup;
    });

    // Returning a function only when a ref asked for one keeps the React 18 path
    // (React calls this ref again with `null`) untouched and avoids its dev warning.
    if (!hasCleanup) {
      return;
    }

    return () => {
      refs.forEach((ref, index) => {
        if (ref == null) {
          return;
        }

        const cleanup = cleanups[index];

        if (typeof cleanup === 'function') {
          cleanup();
          return;
        }

        setRef(ref, null);
      });
    };
  };
}

function setRef<T>(ref: RefObject<T> | RefCallback<T>, value: T | null) {
  if (typeof ref === 'function') {
    return ref(value);
  }

  (ref as RefObject<T | null>).current = value;
}
