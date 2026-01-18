import { isServer } from '../isServer.ts';

/**
 * Returns the current on-screen keyboard height in pixels.
 *
 * This function uses the Visual Viewport API to calculate the keyboard height.
 * It assumes a modern environment where Visual Viewport is supported
 * (Safari / WKWebView 14+, Chrome / Android WebView 80+).
 *
 * The keyboard height is computed as:
 *   window.innerHeight - visualViewport.height - visualViewport.offsetTop
 *
 * The subtraction of `offsetTop` is required to correctly handle iOS behavior
 * where the visual viewport may shift vertically when the keyboard appears.
 *
 * @returns {number} The keyboard height in pixels. Returns 0 if the keyboard
 * is not visible.
 *
 * @example
 * ```ts
 * const height = getKeyboardHeight();
 *
 * if (height > 0) {
 *   footer.style.paddingBottom = `${height}px`;
 * }
 * ```
 */
export function getKeyboardHeight(): number {
  if (isServer()) {
    return 0;
  }

  const visualViewport = window.visualViewport;
  if (visualViewport == null) {
    // Defensive guard; not expected to run in supported environments
    return 0;
  }
  const height = window.innerHeight - visualViewport.height - visualViewport.offsetTop;
  return Math.max(0, height);
}
