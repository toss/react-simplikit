import { type MouseEvent, type TouchEvent, useCallback, useRef } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';
type Handler<E extends HTMLElement> = (event: MouseEvent<E> | TouchEvent<E>) => void;

export type UseLongPressOptions<E extends HTMLElement> = {
  delay?: number;
  moveThreshold?: {
    x?: number;
    y?: number;
  };
  onClick?: Handler<E>;
  onLongPressEnd?: Handler<E>;
};

/**
 * @deprecated This hook is deprecated as it depends on browser-specific APIs (DOM events, window.setTimeout).
 * react-simplikit is now focused on platform-independent, pure state/logic hooks.
 * This hook will be removed in a future major version.
 *
 * @description
 * `useLongPress` is a React hook that detects when an element is pressed and held for a specified duration.
 * It handles both mouse and touch events, making it work consistently across desktop and mobile devices.
 *
 * @template {HTMLElement} E - The HTML element type that will use the long press handlers.
 * @param {(event: React.MouseEvent<E> | React.TouchEvent<E>) => void} onLongPress - The callback function to be executed when a long press is detected.
 * @param {UseLongPressOptions} [options] - Configuration options for the long press behavior.
 * @param {number} [options.delay=500] - The time in milliseconds before triggering the long press. Defaults to 500ms.
 * @param {Object} [options.moveThreshold] - Maximum movement allowed before canceling a long press.
 * @param {number} [options.moveThreshold.x] - Maximum horizontal movement in pixels.
 * @param {number} [options.moveThreshold.y] - Maximum vertical movement in pixels.
 * @param {(event) => void} [options.onClick] - Optional function to execute on a normal click (press and release before delay).
 * @param {(event) => void} [options.onLongPressEnd] - Optional function to execute when a long press ends.
 *
 * @returns {Object} Event handlers to attach to an element.
 * - onMouseDown `(event: MouseEvent<E> | TouchEvent<E>) => void` - Event handler for mouse down events.
 * - onMouseUp `(event: MouseEvent<E> | TouchEvent<E>) => void` - Event handler for mouse up events.
 * - onMouseLeave `(event: MouseEvent<E> | TouchEvent<E>) => void` - Event handler for mouse leave events.
 * - onTouchStart `(event: MouseEvent<E> | TouchEvent<E>) => void` - Event handler for touch start events.
 * - onTouchEnd `(event: MouseEvent<E> | TouchEvent<E>) => void` - Event handler for touch end events.
 * - onMouseMove `(event: MouseEvent<E> | TouchEvent<E>) => void` - Event handler for mouse move events. Included if `moveThreshold` is provided.
 * - onTouchMove `(event: MouseEvent<E> | TouchEvent<E>) => void` - Event handler for touch move events. Included if `moveThreshold` is provided.
 *
 * @example
 * import { useLongPress } from 'react-simplikit';
 *
 * function ContextMenu() {
 *   const [menuVisible, setMenuVisible] = useState(false);
 *
 *   const longPressHandlers = useLongPress(
 *     () => setMenuVisible(true),
 *     {
 *       delay: 400,
 *       onClick: () => console.log('Normal click'),
 *       onLongPressEnd: () => console.log('Long press completed')
 *     }
 *   );
 *
 *   return (
 *     <div>
 *       <button {...longPressHandlers}>Press and hold</button>
 *       {menuVisible && <div className="context-menu">Context Menu</div>}
 *     </div>
 *   );
 * }
 */
export function useLongPress<E extends HTMLElement = HTMLElement>(
  onLongPress: Handler<E>,
  { delay = 500, moveThreshold, onClick, onLongPressEnd }: UseLongPressOptions<E> = {}
) {
  const timeoutRef = useRef<number | null>(null);
  const isLongPressActiveRef = useRef(false);
  const initialPositionRef = useRef({ x: 0, y: 0 });

  const preservedOnLongPress = usePreservedCallback(onLongPress);
  const preservedOnClick = usePreservedCallback(onClick || (() => {}));
  const preservedOnLongPressEnd = usePreservedCallback(onLongPressEnd || (() => {}));

  const hasThreshold = moveThreshold?.x !== undefined || moveThreshold?.y !== undefined;

  const getClientPosition = useCallback((event: MouseEvent<E> | TouchEvent<E>) => {
    if ('touches' in event.nativeEvent) {
      const touch = event.nativeEvent.touches[0];
      return { x: touch.clientX, y: touch.clientY };
    }
    return {
      x: event.nativeEvent.clientX,
      y: event.nativeEvent.clientY,
    };
  }, []);

  const isMovedBeyondThreshold = useCallback(
    (event: MouseEvent<E> | TouchEvent<E>) => {
      const { x, y } = getClientPosition(event);
      const deltaX = Math.abs(x - initialPositionRef.current.x);
      const deltaY = Math.abs(y - initialPositionRef.current.y);

      return (
        (moveThreshold?.x !== undefined && deltaX > moveThreshold.x) ||
        (moveThreshold?.y !== undefined && deltaY > moveThreshold.y)
      );
    },
    [getClientPosition, moveThreshold]
  );

  const cancelLongPress = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handlePressStart = useCallback(
    (event: MouseEvent<E> | TouchEvent<E>) => {
      cancelLongPress();
      const position = getClientPosition(event);

      initialPositionRef.current = position;
      isLongPressActiveRef.current = false;

      timeoutRef.current = window.setTimeout(() => {
        isLongPressActiveRef.current = true;
        preservedOnLongPress(event);
      }, delay);
    },
    [cancelLongPress, delay, getClientPosition, preservedOnLongPress]
  );

  const handlePressEnd = useCallback(
    (event: MouseEvent<E> | TouchEvent<E>) => {
      if (isLongPressActiveRef.current) {
        preservedOnLongPressEnd(event);
      } else if (timeoutRef.current !== null) {
        preservedOnClick(event);
      }

      cancelLongPress();
      isLongPressActiveRef.current = false;
    },
    [cancelLongPress, preservedOnClick, preservedOnLongPressEnd]
  );

  const handlePressMove = useCallback(
    (event: MouseEvent<E> | TouchEvent<E>) => {
      if (timeoutRef.current !== null && isMovedBeyondThreshold(event)) {
        cancelLongPress();
      }
    },
    [cancelLongPress, isMovedBeyondThreshold]
  );

  return {
    onMouseDown: handlePressStart,
    onMouseUp: handlePressEnd,
    onMouseLeave: cancelLongPress,
    onTouchStart: handlePressStart,
    onTouchEnd: handlePressEnd,
    ...(hasThreshold ? { onTouchMove: handlePressMove, onMouseMove: handlePressMove } : {}),
  };
}
