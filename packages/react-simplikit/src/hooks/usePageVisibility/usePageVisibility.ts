import { useEffect, useState } from 'react';

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
 * @description
 * `usePageVisibility` is a React hook that detects page visibility changes.
 * It monitors when the user switches tabs or minimizes the browser using the Page Visibility API.
 * Useful for pausing/resuming animations, videos, or background tasks to improve performance and the user experience.
 *
 * @see `usePageVisibilityEffect` runs a callback on each change instead of returning state.
 *
 * @returns {PageVisibility} Page visibility information
 * - isVisible `boolean` - `true` if the page is currently visible to the user
 * - visibilityState `'visible' | 'hidden'` - Current visibility state
 *
 * @example
 * <caption>Video player control</caption>
 * // Pauses the video automatically when the user switches to another tab
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
 *
 * @example
 * <caption>Analytics tracking</caption>
 * // Tracks when the user leaves or returns to the page
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
 *
 * @remarks
 * - **SSR safety**: The hook returns `{ isVisible: true, visibilityState: 'visible' }` on the server and on the first client render, then syncs to `document.visibilityState` after mount.
 * - **Browser support**: The Page Visibility API is supported in every modern browser. See the [MDN browser compatibility table](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API#browser_compatibility) for details.
 * - **Performance**: The hook listens to the native `visibilitychange` event, so it adds no polling and negligible overhead.
 * - **Visibility state**: Only `'visible'` and `'hidden'` are returned; the deprecated `'prerender'` state is excluded.
 */
export function usePageVisibility(): PageVisibility {
  const [pageVisibility, setPageVisibility] = useState<PageVisibility>(INITIAL_PAGE_VISIBILITY);

  useEffect(function handleVisibilityChange() {
    function updateVisibility() {
      const next = getPageVisibility();

      setPageVisibility(prev => (prev.visibilityState === next.visibilityState ? prev : next));
    }

    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);

    return function cleanup() {
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  return pageVisibility;
}

const INITIAL_PAGE_VISIBILITY: PageVisibility = {
  isVisible: true,
  visibilityState: 'visible',
};

function getPageVisibility(): PageVisibility {
  const visibilityState: VisibilityState = document.visibilityState;

  return {
    isVisible: visibilityState === 'visible',
    visibilityState,
  };
}
