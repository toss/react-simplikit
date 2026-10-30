import { type PointerEvent, useCallback, useEffect, useRef } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';

type Handler<E extends HTMLElement> = (event: PointerEvent<E>) => void;

export type UseLongPressOptions<E extends HTMLElement> = {
  delayMs?: number;
  moveThreshold?: {
    x?: number;
    y?: number;
  };
  onClick?: Handler<E>;
  onLongPressEnd?: Handler<E>;
};

type LongPressHandlers<E extends HTMLElement> = {
  onPointerDown: Handler<E>;
  onPointerUp: Handler<E>;
  onPointerLeave: Handler<E>;
  onPointerCancel: Handler<E>;
  onPointerMove?: Handler<E>;
};

type PressOutcome = 'release' | 'cancel';

/**
 * @description
 * `useLongPress` is a React hook that detects when an element is pressed and held for a specified duration.
 * It listens to pointer events, so a mouse, touch, or pen press is one stream and the emulated mouse events after a tap do not start a second press.
 * `pointercancel` cancels the press, including when the browser takes the pointer to scroll.
 * A non-primary pointer and any button other than the primary button are ignored.
 *
 * @template {HTMLElement} E - The HTML element type that will use the long press handlers.
 * @param {(event: React.PointerEvent<E>) => void} onLongPress - The callback function to be executed when a long press is detected.
 * @param {UseLongPressOptions} [options] - Configuration options for the long press behavior.
 * @param {number} [options.delayMs=500] - The time in milliseconds before triggering the long press. Defaults to 500ms.
 * @param {Object} [options.moveThreshold] - Maximum movement allowed before canceling a long press.
 * @param {number} [options.moveThreshold.x] - Maximum horizontal movement in pixels.
 * @param {number} [options.moveThreshold.y] - Maximum vertical movement in pixels.
 * @param {(event: React.PointerEvent<E>) => void} [options.onClick] - Optional function to execute on a normal click (press and release before delay).
 * @param {(event: React.PointerEvent<E>) => void} [options.onLongPressEnd] - Optional function to execute when a long press ends.
 *
 * @returns {Object} Event handlers to attach to an element.
 * - onPointerDown `(event: React.PointerEvent<E>) => void` - Starts a press for the primary pointer's primary button.
 * - onPointerUp `(event: React.PointerEvent<E>) => void` - Ends the tracked press. Calls `onClick` when released before the delay, or `onLongPressEnd` when a long press already fired.
 * - onPointerLeave `(event: React.PointerEvent<E>) => void` - Cancels the tracked press when the pointer leaves the element. Does not call `onClick`. Calls `onLongPressEnd` when a long press already fired.
 * - onPointerCancel `(event: React.PointerEvent<E>) => void` - Cancels the tracked press when the browser cancels the pointer, for example when scrolling starts. Does not call `onClick`. Calls `onLongPressEnd` when a long press already fired.
 * - onPointerMove `(event: React.PointerEvent<E>) => void` - Cancels a pending long press when movement exceeds `moveThreshold`. Included if `moveThreshold` is provided.
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
 *       delayMs: 400,
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
  { delayMs = 500, moveThreshold, onClick, onLongPressEnd }: UseLongPressOptions<E> = {}
): LongPressHandlers<E> {
  const timeoutRef = useRef<number | null>(null);
  const isLongPressActiveRef = useRef(false);
  const initialPositionRef = useRef({ x: 0, y: 0 });
  // `0` is a valid pointer id, so absence is `null` rather than a falsy number.
  const pointerIdRef = useRef<number | null>(null);

  const preservedOnLongPress = usePreservedCallback(onLongPress);
  const preservedOnClick = usePreservedCallback(onClick ?? noop);
  const preservedOnLongPressEnd = usePreservedCallback(onLongPressEnd ?? noop);

  const hasThreshold = moveThreshold?.x !== undefined || moveThreshold?.y !== undefined;

  const clearTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(
    function cleanupLongPressOnUnmount() {
      return clearTimer;
    },
    [clearTimer]
  );

  const finishTrackedPointer = useCallback(
    (event: PointerEvent<E>, outcome: PressOutcome) => {
      if (pointerIdRef.current !== event.pointerId) {
        return;
      }

      const shouldEndLongPress = isLongPressActiveRef.current;
      const shouldClick = outcome === 'release' && shouldEndLongPress === false && timeoutRef.current !== null;

      clearTimer();
      pointerIdRef.current = null;
      isLongPressActiveRef.current = false;

      if (shouldEndLongPress) {
        preservedOnLongPressEnd(event);
        return;
      }

      if (shouldClick) {
        preservedOnClick(event);
      }
    },
    [clearTimer, preservedOnClick, preservedOnLongPressEnd]
  );

  const handlePointerDown = useCallback(
    (event: PointerEvent<E>) => {
      if (canStartPress(event) === false) {
        return;
      }

      // A second contact must not restart or replace the press already in progress.
      if (pointerIdRef.current !== null) {
        return;
      }

      clearTimer();
      pointerIdRef.current = event.pointerId;
      initialPositionRef.current = { x: event.clientX, y: event.clientY };
      isLongPressActiveRef.current = false;

      timeoutRef.current = window.setTimeout(function triggerLongPress() {
        timeoutRef.current = null;
        isLongPressActiveRef.current = true;
        preservedOnLongPress(event);
      }, delayMs);
    },
    [clearTimer, delayMs, preservedOnLongPress]
  );

  const handlePointerUp = useCallback(
    (event: PointerEvent<E>) => {
      finishTrackedPointer(event, 'release');
    },
    [finishTrackedPointer]
  );

  const cancelTrackedPointer = useCallback(
    (event: PointerEvent<E>) => {
      finishTrackedPointer(event, 'cancel');
    },
    [finishTrackedPointer]
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<E>) => {
      if (pointerIdRef.current !== event.pointerId) {
        return;
      }

      if (timeoutRef.current === null) {
        return;
      }

      const deltaX = Math.abs(event.clientX - initialPositionRef.current.x);
      const deltaY = Math.abs(event.clientY - initialPositionRef.current.y);
      const movedBeyondX = moveThreshold?.x !== undefined && deltaX > moveThreshold.x;
      const movedBeyondY = moveThreshold?.y !== undefined && deltaY > moveThreshold.y;

      if (movedBeyondX || movedBeyondY) {
        clearTimer();
      }
    },
    [clearTimer, moveThreshold]
  );

  return {
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onPointerLeave: cancelTrackedPointer,
    onPointerCancel: cancelTrackedPointer,
    ...(hasThreshold ? { onPointerMove: handlePointerMove } : {}),
  };
}

function noop() {}

function canStartPress(event: PointerEvent<HTMLElement>) {
  return event.isPrimary === true && event.button === 0;
}
