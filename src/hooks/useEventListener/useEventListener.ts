/* eslint-disable @typescript-eslint/no-explicit-any */
import { Ref, useEffect, useRef } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/usePreservedCallback.ts';

/**
 * @description
 * `useEventListener` is a React hook that attaches an event listener to a DOM element.
 * It helps manage DOM event listeners in a clean, type-safe way with automatic cleanup and stable callback references.
 *
 * @param {K} type - The event type to listen for (e.g., 'click', 'keydown').
 * @param {(event: HTMLElementEventMap[K]) => any} listener - The callback function to be called when the event occurs.
 * @param {AddEventListenerOptions} [options] - Optional options object for the event listener (e.g., capture, once, passive).
 *
 * @returns {Ref<T>} A React ref object that should be assigned to the target DOM element.
 *
 * @example
 * function LoggerButton() {
 *   const [count, setCount] = useState(0);
 *   const buttonRef = useEventListener('click', () => {
 *     setCount(prev => prev + 1);
 *   });
 *
 *   return (
 *     <button ref={buttonRef}>{count}</button>
 *   );
 * }
 */

export const useEventListener = <K extends keyof HTMLElementEventMap, T extends HTMLElement = any>(
  type: K,
  listener: (event: HTMLElementEventMap[K]) => any,
  options?: AddEventListenerOptions
): Ref<T> => {
  const ref = useRef<T>(null);
  const preservedListener = usePreservedCallback(listener);

  useEffect(() => {
    const node = ref.current;

    if (node) {
      node.addEventListener(type, preservedListener, options);
    }
    return () => {
      node?.removeEventListener(type, preservedListener, options);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preservedListener, options]);

  return ref;
};
