import { useEffect, useState } from 'react';

import { isServer } from '../../utils/isServer.ts';

/**
 * Page visibility state derived from browser's DocumentVisibilityState.
 * Excludes 'prerender' as it is deprecated and not used in modern browsers.
 */
export type VisibilityState = Exclude<DocumentVisibilityState, 'prerender'>;

/**
 * Page visibility information
 */
export type PageVisibility = {
  /** True if page is currently visible */
  isVisible: boolean;
  /** Current visibility state: 'visible' | 'hidden' */
  visibilityState: VisibilityState;
};

/**
 * React hook to detect page visibility changes
 *
 * Monitors when the user switches tabs or minimizes the browser using the Page Visibility API.
 * Useful for pausing/resuming animations, videos, or background tasks.
 *
 * **SSR Behavior**: Returns `{ isVisible: true, visibilityState: 'visible' }` during server-side rendering.
 *
 * @returns {PageVisibility} Page visibility information
 * - `isVisible` - True if page is currently visible to the user
 * - `visibilityState` - Current visibility state: 'visible' | 'hidden'
 *
 * @example
 * ```tsx
 * function VideoPlayer() {
 *   const { isVisible } = usePageVisibility();
 *   const videoRef = useRef<HTMLVideoElement>(null);
 *
 *   useEffect(() => {
 *     if (!videoRef.current) return;
 *
 *     // Pause video when tab is hidden
 *     if (!isVisible) {
 *       videoRef.current.pause();
 *     }
 *   }, [isVisible]);
 *
 *   return <video ref={videoRef} src="video.mp4" />;
 * }
 * ```
 *
 * @example
 * ```tsx
 * function Analytics() {
 *   const { isVisible, visibilityState } = usePageVisibility();
 *
 *   useEffect(() => {
 *     if (visibilityState === 'hidden') {
 *       // Track when user leaves the page
 *       analytics.track('page_hidden');
 *     }
 *   }, [visibilityState]);
 *
 *   return null;
 * }
 * ```
 */
export function usePageVisibility(): PageVisibility {
  const [pageVisibility, setPageVisibility] = useState<PageVisibility>(() => getPageVisibility());

  useEffect(function handleVisibilityChange() {
    function updateVisibility() {
      setPageVisibility(() => getPageVisibility());
    }

    document.addEventListener('visibilitychange', updateVisibility);

    return function cleanup() {
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  return pageVisibility;
}

function getPageVisibility(): PageVisibility {
  if (isServer()) {
    return {
      isVisible: true,
      visibilityState: 'visible',
    };
  }

  const visibilityState: VisibilityState = document.visibilityState;

  return {
    isVisible: visibilityState === 'visible',
    visibilityState,
  };
}
