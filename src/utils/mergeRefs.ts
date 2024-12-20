import { RefCallback, RefObject } from 'react';

/**
 * A utility function that merges multiple React refs into a single ref.
 *
 * @description
 * This function takes multiple refs (RefObject or RefCallback) and returns a single ref that updates all provided refs.
 * It's useful when you need to pass multiple refs to a single element.
 *
 * @param refs - An array of refs to be merged. Each ref can be either a RefObject or RefCallback.
 * @returns A single ref callback that updates all provided refs.
 *
 * @example
 * forwardRef(function Component(props, parentRef) {
 *   const myRef = useRef(null);
 *
 *   return <div ref={mergeRefs(myRef, parentRef)} />;
 * })
 */
export function mergeRefs<T>(...refs: Array<RefObject<T> | RefCallback<T>>): RefCallback<T> {
  return value => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as RefObject<T | null>).current = value;
      }
    }
  };
}
