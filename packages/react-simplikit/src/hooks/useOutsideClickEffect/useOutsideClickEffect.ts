import { useEffect, useRef } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';

type OneOrMore<T> = T | T[];

/**
 * @deprecated This hook is deprecated as it depends on browser-specific APIs (DOM events, document).
 * react-simplikit is now focused on platform-independent, pure state/logic hooks.
 * This hook will be removed in a future major version.
 *
 * @description
 * `useOutsideClickEffect` is a React hook that triggers a callback when a click event occurs outside the specified container(s).
 * It is useful for closing modals, dropdowns, tooltips, and other UI components when clicking outside.
 *
 * @param {HTMLElement | HTMLElement[] | null} container - A single HTML element, an array of HTML elements, or `null`.
 *   If `null`, no event listener is attached.
 * @param {() => void} callback - A function that is executed when clicking outside the specified container(s).
 *
 * @example
 * import { useOutsideClickEffect } from 'react-simplikit';
 * import { useState } from 'react';
 *
 * function Example() {
 *   const [wrapperEl, setWrapperEl] = useState<HTMLDivElement | null>(null);
 *
 *   useOutsideClickEffect(wrapperEl, () => {
 *     console.log('Outside clicked!');
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
