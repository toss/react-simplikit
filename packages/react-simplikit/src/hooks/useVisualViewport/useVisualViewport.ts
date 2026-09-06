import { startTransition, useCallback, useEffect, useState } from 'react';

import { isServer } from '../../utils/isServer/index.ts';

type VisualViewportState = {
  /** Viewport width (px) */
  width: number;
  /** Viewport height (px) */
  height: number;
  /**
   * Viewport left offset (px) from the layout viewport
   *
   * Typically 0 unless horizontal scrolling or panning occurs
   */
  offsetLeft: number;
  /**
   * Viewport top offset (px) from the layout viewport
   *
   * On iOS: Becomes negative when keyboard appears (e.g., -300px means 300px keyboard height)
   * On Android: Typically remains 0
   *
   * Use `-offsetTop` to get accurate keyboard height on iOS
   */
  offsetTop: number;
  /**
   * Pinch-zoom scaling factor
   *
   * - 1.0 = no zoom (default)
   * - > 1.0 = zoomed in
   * - < 1.0 = zoomed out (rare, depends on viewport settings)
   *
   * @example
   * ```tsx
   * const { viewport } = useVisualViewport();
   * if (viewport && viewport.scale > 1.3) {
   *   // Hide floating UI when user zooms in
   *   setShowFloatingButton(false);
   * }
   * ```
   */
  scale: number;
};

/**
 * @description
 * `useVisualViewport` is a React hook that tracks Visual Viewport changes.
 * It returns the actual visible area in mobile WebView, which changes when
 * the keyboard appears or the user zooms/scrolls.
 *
 * **Important:** `viewport` is `null` on SSR or in browsers that don't support Visual Viewport API.
 * Always check for null before accessing viewport properties.
 *
 * **Tip:** If you only need keyboard height, use `useKeyboardHeight()` instead
 * for a simpler API.
 *
 * @returns {{ viewport: VisualViewportState | null }} An object containing the Visual Viewport state.
 * - viewport `VisualViewportState | null` - Visual Viewport state object, or `null` if not supported (SSR or browsers without the Visual Viewport API);
 * - viewport.width `number` - Viewport width in pixels;
 * - viewport.height `number` - Viewport height in pixels;
 * - viewport.offsetLeft `number` - Viewport left offset in pixels from the layout viewport. Typically 0 unless horizontal scrolling or panning occurs;
 * - viewport.offsetTop `number` - Viewport top offset in pixels from the layout viewport. Becomes negative on iOS when the keyboard appears, so use `-offsetTop` for the keyboard height. Typically remains 0 on Android;
 * - viewport.scale `number` - Pinch-zoom scaling factor. 1.0 means no zoom, greater than 1.0 means zoomed in;
 *
 * @see {@link useKeyboardHeight} - Simpler hook for keyboard height only
 *
 * @example
 * function CustomLayout() {
 *   const { viewport } = useVisualViewport();
 *
 *   // Always check for null first
 *   if (!viewport) {
 *     return <div>Visual Viewport not supported</div>;
 *   }
 *
 *   const { width, height, offsetTop, scale } = viewport;
 *
 *   // Hide floating UI when user zooms in
 *   const showFloatingUI = scale <= 1.3;
 *
 *   return (
 *     <div style={{ height }}>
 *       {showFloatingUI && <FloatingButton />}
 *       Viewport-aware content
 *     </div>
 *   );
 * }
 */
export function useVisualViewport(): { viewport: VisualViewportState | null } {
  const visualViewport = isServer() ? null : window.visualViewport;

  const [viewport, setViewport] = useState<VisualViewportState | null>(() =>
    visualViewport != null ? getVisualViewportState(visualViewport) : null
  );

  const updateViewportState = useCallback(() => {
    startTransition(() => {
      setViewport(window.visualViewport != null ? getVisualViewportState(window.visualViewport) : null);
    });
  }, []);

  useEffect(
    function handleVisualViewportChange() {
      window.visualViewport?.addEventListener('resize', updateViewportState);
      window.visualViewport?.addEventListener('scroll', updateViewportState);

      return function cleanup() {
        window.visualViewport?.removeEventListener('resize', updateViewportState);
        window.visualViewport?.removeEventListener('scroll', updateViewportState);
      };
    },
    [updateViewportState]
  );

  return { viewport };
}

function getVisualViewportState(visualViewport: VisualViewport): VisualViewportState {
  return {
    width: visualViewport.width,
    height: visualViewport.height,
    offsetLeft: visualViewport.offsetLeft,
    offsetTop: visualViewport.offsetTop,
    scale: visualViewport.scale,
  };
}
