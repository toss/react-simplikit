import { Ref, RefCallback } from 'react';

type StrictRef<T> = NonNullable<Ref<T>>;
type RefCleanup<T> = ReturnType<RefCallback<T>>;

/**
 * @description
 * This function takes multiple refs (RefObject or RefCallback) and returns a single ref that updates all provided refs.
 * It's useful when you need to pass multiple refs to a single element.
 *
 * @template T - The type of target to be referenced.
 *
 * @param {Array<Ref<T> | undefined>} refs - An array of refs to be merged. Each ref can be either a RefObject or RefCallback.
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

function assignRef<T>(ref: StrictRef<T>, value: T | null): RefCleanup<T> {
  if (typeof ref === 'function') {
    return ref(value);
  }

  ref.current = value;
}

export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): RefCallback<T> {
  const availableRefs = refs.filter(ref => ref != null);
  const cleanupMap = new Map<Ref<T>, Exclude<RefCleanup<T>, void>>();

  return value => {
    for (const ref of availableRefs) {
      const cleanup = assignRef(ref, value);
      if (cleanup) {
        cleanupMap.set(ref, cleanup);
      }
    }

    return () => {
      for (const ref of availableRefs) {
        const cleanup = cleanupMap.get(ref);
        if (cleanup && typeof cleanup === 'function') {
          cleanup();
          continue;
        }

        assignRef(ref, null);
      }

      cleanupMap.clear();
    };
  };
}
