import { useCallback, useEffect, useRef, useState } from 'react';

import { isServer } from '../../utils/isServer.ts';

type ScrollDirection = 'up' | 'down' | null;

type ScrollDirectionState = {
  /** Current scroll direction */
  direction: ScrollDirection;
  /** Current scroll Y position (px) */
  position: number;
};

type UseScrollDirectionOptions = {
  /** Throttle interval (ms) - default: 50ms */
  throttleMs?: number;
};

/**
 * React hook to detect scroll direction
 *
 * Returns scroll direction (up/down) and current scroll position.
 * Throttled by default (50ms) for performance.
 *
 * @param options.throttleMs - Throttle interval (default: 50ms)
 * @returns Scroll direction state (direction: 'up' | 'down' | null, position: number)
 *
 * @example
 * ```tsx
 * function Header() {
 *   const { direction, position } = useScrollDirection();
 *
 *   // Hide header on scroll down
 *   const isHidden = direction === 'down' && position > 100;
 *
 *   return (
 *     <header className={isHidden ? 'hidden' : 'visible'}>
 *       My Header
 *     </header>
 *   );
 * }
 * ```
 */
export function useScrollDirection(options: UseScrollDirectionOptions = {}): ScrollDirectionState {
  const { throttleMs = 50 } = options;

  const [scrollInfo, setScrollInfo] = useState<ScrollDirectionState>({
    direction: null,
    position: isServer() ? 0 : window.scrollY,
  });

  const lastScrollYRef = useRef(isServer() ? 0 : window.scrollY);
  const throttleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateScrollDirection = useCallback(
    ({ currentScrollY, lastScrollY }: { currentScrollY: number; lastScrollY: number }) => {
      if (currentScrollY > lastScrollY) {
        setScrollInfo({ direction: 'down', position: currentScrollY });
        return;
      }

      if (currentScrollY < lastScrollY) {
        setScrollInfo({ direction: 'up', position: currentScrollY });
        return;
      }
    },
    []
  );

  const startThrottle = useCallback(() => {
    throttleTimerRef.current = setTimeout(function clearThrottle() {
      throttleTimerRef.current = null;
    }, throttleMs);
  }, [throttleMs]);

  useEffect(
    function handleScrollDirectionChange() {
      function handleScroll() {
        if (throttleTimerRef.current != null) {
          return;
        }

        const currentScrollY = window.scrollY;
        const lastScrollY = lastScrollYRef.current;

        lastScrollYRef.current = currentScrollY;
        startThrottle();
        updateScrollDirection({ currentScrollY, lastScrollY });
      }

      window.addEventListener('scroll', handleScroll, { passive: true });

      return function cleanup() {
        window.removeEventListener('scroll', handleScroll);
        if (throttleTimerRef.current != null) {
          clearTimeout(throttleTimerRef.current);
        }
      };
    },
    [startThrottle, updateScrollDirection]
  );

  return scrollInfo;
}
