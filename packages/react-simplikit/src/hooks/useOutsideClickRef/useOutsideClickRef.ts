import { useCallback, useEffect, useRef } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';

export type UseOutsideClickRefOptions = {
  onOutsideClick: () => void;
  enabled?: boolean;
};

/**
 * @description
 * `useOutsideClickRef` is a React hook that returns a callback ref and calls `onOutsideClick` when a click happens outside every element the ref is attached to.
 * Attach the same ref to a trigger, its menu and any portal content, and a press that starts inside and ends outside is not counted as an outside click.
 *
 * @param {Object} options - Options for detecting outside clicks.
 * @param {() => void} options.onOutsideClick - A function that is executed when a click happens outside every attached element.
 *   It runs before the clicked element's own `onClick`.
 * @param {boolean} [options.enabled=true] - Whether to detect outside clicks. While `false`, `onOutsideClick` is not called.
 *
 * @returns {(element: Element | null) => void} A callback ref to pass to the `ref` attribute of each element that counts as inside.
 *   It keeps the same identity across renders.
 *
 * @example
 * import { useOutsideClickRef } from 'react-simplikit';
 * import { useState } from 'react';
 *
 * function Dropdown({ onClose }: { onClose: () => void }) {
 *   const [open, setOpen] = useState(false);
 *   const ref = useOutsideClickRef({
 *     enabled: open,
 *     onOutsideClick: () => {
 *       setOpen(false);
 *       onClose();
 *     },
 *   });
 *
 *   return (
 *     <>
 *       <button ref={ref} onClick={() => setOpen(prev => !prev)}>
 *         Menu
 *       </button>
 *       {open && <ul ref={ref}>...</ul>}
 *     </>
 *   );
 * }
 */
export function useOutsideClickRef({
  onOutsideClick,
  enabled = true,
}: UseOutsideClickRefOptions): (element: Element | null) => void {
  const elementsRef = useRef<Set<Element>>(new Set());
  // Kept outside the click subscription, so a press that starts while `enabled` is turning true
  // (e.g. a trigger that opens on `pointerdown`) is still remembered when its click arrives.
  const pressStartedInsideRef = useRef(false);
  const handleOutsideClick = usePreservedCallback(onOutsideClick);

  useEffect(function subscribePointerDown() {
    function handlePointerDown(event: PointerEvent) {
      pressStartedInsideRef.current = isEventInside(elementsRef.current, event);
    }

    document.addEventListener('pointerdown', handlePointerDown, true);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
    };
  }, []);

  useEffect(
    function subscribeOutsideClick() {
      if (!enabled) {
        return;
      }

      const elements = elementsRef.current;

      // Capture phase: decide before the target's own handlers run, since they may remove the target
      // from the document or stop propagation. It also never sees the click that mounted this hook,
      // because that click has already passed `document` on its way down.
      function handleClick(event: MouseEvent) {
        // A click without a click count (keyboard, `element.click()`) has no press of its own,
        // so a flag left by a press that never produced a click must not apply to it.
        const startedInside = pressStartedInsideRef.current && event.detail > 0;
        pressStartedInsideRef.current = false;

        removeDisconnected(elements);

        if (elements.size === 0 || event.target == null) {
          return;
        }

        if (startedInside || isEventInside(elements, event)) {
          return;
        }

        handleOutsideClick();
      }

      document.addEventListener('click', handleClick, true);

      return () => {
        document.removeEventListener('click', handleClick, true);
      };
    },
    [enabled, handleOutsideClick]
  );

  return useCallback(function attachElement(element: Element | null) {
    // React calls a ref that returns no cleanup with `null` on detach (React 18 ignores a returned cleanup anyway),
    // so `null` cannot tell which element left. Elements that left the document are dropped later.
    if (element == null) {
      return;
    }

    removeDisconnected(elementsRef.current);
    elementsRef.current.add(element);
  }, []);
}

function removeDisconnected(elements: Set<Element>) {
  elements.forEach(element => {
    if (!element.isConnected) {
      elements.delete(element);
    }
  });
}

// `composedPath()` includes the nodes inside open shadow roots, which `event.target` hides behind the host.
function isEventInside(elements: Set<Element>, event: Event): boolean {
  const path = event.composedPath();

  return Array.from(elements).some(element => path.includes(element));
}
