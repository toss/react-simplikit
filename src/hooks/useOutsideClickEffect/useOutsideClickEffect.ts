import { useEffect, useRef } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';

type OneOrMore<T> = T | T[];

/**
 * @description
 * `useOutsideClickEffect` is  a hook that invokes a callback when a click event occurs on an element outside the entered container.
 *
 * @param container - A single HTML element, array of HTML elements, or null
 * @param callback - Function to be called when clicking outside the container(s)
 *
 * @example
 * import { useOutsideClickEffect } from 'reactive-kit';
 *
 * function Example() {
 *   const [wrapperEl, setWrapperEl] = useState<HTMLDivElement | null>(null);
 *
 *   useOutsideClickEffect(wrapperEl, () => {
 *     console.log('outside clicked!');
 *   });
 *
 *   return <div ref={setWrapperEl}>Content</div>;
 * }
 */
export function useOutsideClickEffect(container: OneOrMore<HTMLElement | null>, callback: () => void) {
  const containers = useRef<HTMLElement[]>([]);

  const handleDocumentClick = usePreservedCallback(({ target }: MouseEvent | TouchEvent) => {
    if (target === null) {
      return;
    }

    if (containers.current.length === 0) {
      return;
    }

    if (containers.current.some(x => x.contains(target as Node))) {
      return;
    }

    callback();
  });

  useEffect(() => {
    containers.current = [container].flat(1).filter(item => item != null);
  }, [container]);

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [handleDocumentClick]);
}
