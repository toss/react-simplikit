import { MouseEvent, useCallback, useEffect, useRef } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';

type UseDoubleClickProps<E extends HTMLElement> = {
  delay?: number;
  click?: (event: MouseEvent<E>) => void;
  doubleClick: (event: MouseEvent<E>) => void;
};

/**
 * @deprecated This hook is deprecated as it depends on browser-specific APIs (DOM events, window.setTimeout).
 * react-simplikit is now focused on platform-independent, pure state/logic hooks.
 * This hook will be removed in a future major version.
 *
 * @description
 * `useDoubleClick` is a React hook that differentiates between single and double click events.
 * It delays the single click callback execution for a specified time, and cancels it if a second click (i.e. a double click) occurs within that time.
 *
 * @template {HTMLElement} E - The specific type of HTMLElement to be used with this hook (e.g., HTMLButtonElement, HTMLDivElement).
 * @param {Object} props - Configuration options for click handling.
 * @param {number} [props.delay=250] - The number of milliseconds to wait before triggering the single click callback. Defaults to 250ms.
 * @param {(event: MouseEvent<E>) => void} [props.click] - The callback function to be executed on a single click.
 * @param {(event: MouseEvent<E>) => void} props.doubleClick - The callback function to be executed on a double click. Required.
 *
 * @returns {(event: MouseEvent<E>) => void} A click handler function to attach to an element's `onClick` event.
 *
 * @example
 * function GalleryCard() {
 *   const [selected, setSelected] = useState(false);
 *
 *   const handleClick = () => setSelected((prev) => !prev);
 *   const handleDoubleClick = () => alert('Zoom in!');
 *
 *   const handleEvent = useDoubleClick({
 *     click: handleClick,
 *     doubleClick: handleDoubleClick,
 *   });
 *
 *   return (
 *     <div onClick={handleEvent}>
 *       {selected ? 'Selected' : 'Not selected'}
 *     </div>
 *   );
 * }
 */
export function useDoubleClick<E extends HTMLElement = HTMLElement>({
  delay = 250,
  click,
  doubleClick,
}: UseDoubleClickProps<E>) {
  const clickTimeout = useRef<number>(null);

  const clearClickTimeout = usePreservedCallback(() => {
    if (clickTimeout.current != null) {
      window.clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }
  });

  useEffect(() => () => clearClickTimeout(), [clearClickTimeout]);

  const handleEvent = useCallback(
    (event: MouseEvent<E>) => {
      clearClickTimeout();

      if (click && event.detail === 1) {
        clickTimeout.current = window.setTimeout(() => {
          click(event);
        }, delay);
      }

      if (event.detail === 2) {
        doubleClick(event);
      }
    },
    [click, doubleClick, delay, clearClickTimeout]
  );

  return handleEvent;
}
