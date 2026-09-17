import { useCallback, useEffect, useRef, useState } from 'react';

import { isServer } from '../../utils/isServer/index.ts';

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
 * @description
 * `useScrollDirection` is a React hook that detects scroll direction.
 * It returns scroll direction (up/down) and current scroll position.
 * Throttled by default (50ms) for performance.
 *
 * @param {UseScrollDirectionOptions} [options] - Configuration options.
 * @param {number} [options.throttleMs=50] - Throttle interval in milliseconds.
 * @returns {ScrollDirectionState} An object containing the scroll direction and position.
 * - direction `'up' | 'down' | null` - The current scroll direction. `null` on the initial render
 * - position `number` - The current vertical scroll position in pixels
 *
 * @example
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
 *
 * @example
 * <caption>Custom throttle interval</caption>
 * function MyComponent() {
 *   // Update every 100ms instead of the default 50ms
 *   const { direction, position } = useScrollDirection({ throttleMs: 100 });
 *
 *   return (
 *     <div>
 *       Scrolling {direction}! Position: {position}px
 *     </div>
 *   );
 * }
 *
 * @remarks
 * - **SSR safety**: The hook checks `isServer()` before reading `window.scrollY`, so it is safe during server-side rendering.
 * - **Performance**: Scroll events are throttled to limit how often they are processed (default: 50ms).
 * - **Passive listener**: The scroll listener is registered with `{ passive: true }` for smoother scrolling.
 * - **Cleanup**: The event listener and the throttle timer are removed when the component unmounts.
 * - **Browser support**: Requires a browser environment with `window` and `scrollY`.
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
