import { MouseEvent, useCallback, useEffect, useRef } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';

type UseDoubleClickProps<E extends HTMLElement> = {
  delayMs?: number;
  onClick?: (event: MouseEvent<E>) => void;
  onDoubleClick: (event: MouseEvent<E>) => void;
};

/**
 * @description
 * `useDoubleClick` is a React hook that differentiates between single and double click events.
 * It delays the single click callback execution for a specified time, and cancels it if a second click (i.e. a double click) occurs within that time.
 *
 * @template {HTMLElement} E - The specific type of HTMLElement to be used with this hook (e.g., HTMLButtonElement, HTMLDivElement).
 * @param {Object} props - Configuration options for click handling.
 * @param {number} [props.delayMs=250] - The number of milliseconds to wait before triggering the single click callback. Defaults to 250ms.
 * @param {(event: MouseEvent<E>) => void} [props.onClick] - The callback function to be executed on a single click.
 * @param {(event: MouseEvent<E>) => void} props.onDoubleClick - The callback function to be executed on a double click. Required.
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
 *     onClick: handleClick,
 *     onDoubleClick: handleDoubleClick,
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
  delayMs = 250,
  onClick,
  onDoubleClick,
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

      if (onClick && event.detail === 1) {
        clickTimeout.current = window.setTimeout(() => {
          onClick(event);
        }, delayMs);
      }

      if (event.detail === 2) {
        onDoubleClick(event);
      }
    },
    [onClick, onDoubleClick, delayMs, clearClickTimeout]
  );

  return handleEvent;
}
