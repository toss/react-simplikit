import { useEffect, useRef } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';

type OneOrMore<T> = T | T[];

/**
 * @description
 * `useOutsideClickEffect` is a React hook that triggers a callback when a click event occurs outside the specified container(s).
 * It is useful for closing modals, dropdowns, tooltips, and other UI components when clicking outside.
 * To treat several elements as inside without keeping each of them in state, use [`useOutsideClickRef`](/hooks/useOutsideClickRef), which returns one ref to attach to all of them.
 *
 * @param {HTMLElement | (HTMLElement | null)[] | null} container - A single HTML element, an array of HTML elements or `null` values, or `null`.
 *   `null` entries are ignored. If no HTML elements remain, the callback is not executed.
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
  const isActive = useRef(true);

  const handleDocumentClick = usePreservedCallback(({ target }: MouseEvent | TouchEvent) => {
    if (!isActive.current) {
      return;
    }

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

  useEffect(
    function updateContainers() {
      const nextContainers = [container].flat(1).filter(item => item != null);

      // React can run this effect while the click that rendered a container (e.g. the one that opened a popup)
      // is still on its way to `document`. Ignore clicks until that dispatch is over, so the same click is not
      // treated as an outside click.
      if (nextContainers.some(item => !containers.current.includes(item))) {
        isActive.current = false;
      }

      containers.current = nextContainers;

      if (isActive.current) {
        return;
      }

      const timeoutId = setTimeout(() => {
        isActive.current = true;
      }, 0);

      return () => {
        clearTimeout(timeoutId);
      };
    },
    [container]
  );

  useEffect(
    function listenToDocumentClick() {
      document.addEventListener('click', handleDocumentClick);

      return () => {
        document.removeEventListener('click', handleDocumentClick);
      };
    },
    [handleDocumentClick]
  );
}
