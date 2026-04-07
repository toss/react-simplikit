import { getKeyboardHeight } from '../getKeyboardHeight/index.ts';
import { isServer } from '../isServer/index.ts';

type SubscribeKeyboardHeightOptions = {
  /**
   * A function that will be called with the updated keyboard height in pixels.
   */
  callback: (height: number) => void;
  /**
   * If true, the callback will be invoked immediately with the current keyboard height.
   * @default false
   */
  immediate?: boolean;
  /**
   * Throttle interval in milliseconds.
   * Events within this interval will be ignored to improve performance.
   * @default 16 (~60fps)
   */
  throttleMs?: number;
};

type SubscribeKeyboardHeightResult = {
  /**
   * Unsubscribes all listeners and stops receiving keyboard height updates.
   */
  unsubscribe: () => void;
};

/**
 * @description
 * `subscribeKeyboardHeight` is a utility function that subscribes to changes in the on-screen keyboard height.
 *
 * The provided callback is invoked whenever the keyboard height may change,
 * including when the keyboard appears, disappears, or changes size.
 *
 * Internally, this function listens to both `resize` and `scroll` events
 * on the Visual Viewport:
 * - `resize`: triggered when the visual viewport height changes
 * - `scroll`: triggered when the visual viewport offset changes
 *   (important for iOS where the viewport can shift without resizing)
 *
 * Performance optimizations:
 * - Throttled by default (16ms, ~60fps) to prevent excessive callback invocations
 * - Skips callback when height hasn't changed (deduplication)
 *
 * @param {SubscribeKeyboardHeightOptions} options - Configuration options
 * @param {(height: number) => void} options.callback - A function that will be called with the updated keyboard height in pixels.
 * @param {boolean} [options.immediate=false] - If true, the callback will be invoked immediately with the current keyboard height.
 * @param {number} [options.throttleMs=16] - Throttle interval in milliseconds.
 *
 * @returns {SubscribeKeyboardHeightResult} An object containing the unsubscribe function.
 * - unsubscribe `() => void` - Unsubscribes all listeners and stops receiving keyboard height updates.
 *
 * @example
 * const { unsubscribe } = subscribeKeyboardHeight({
 *   callback: (height) => {
 *     footer.style.paddingBottom = `${height}px`;
 *   },
 *   immediate: true,
 * });
 *
 * // Later, when cleanup is needed
 * unsubscribe();
 */
export function subscribeKeyboardHeight({
  callback,
  immediate = false,
  throttleMs = 16,
}: SubscribeKeyboardHeightOptions): SubscribeKeyboardHeightResult {
  if (isServer()) {
    return { unsubscribe: () => {} };
  }

  const visualViewport = window.visualViewport;
  if (!visualViewport) {
    return { unsubscribe: () => {} };
  }

  let lastHeight: number | null = null;
  let throttleTimer: ReturnType<typeof setTimeout> | null = null;

  const handler = () => {
    // Skip if throttled
    if (throttleTimer != null) {
      return;
    }

    const currentHeight = getKeyboardHeight();

    // Skip if height hasn't changed (deduplication)
    if (lastHeight === currentHeight) {
      return;
    }

    lastHeight = currentHeight;
    callback(currentHeight);

    // Start throttle timer
    throttleTimer = setTimeout(() => {
      throttleTimer = null;
    }, throttleMs);
  };

  if (immediate) {
    const currentHeight = getKeyboardHeight();
    lastHeight = currentHeight;
    callback(currentHeight);
  }

  visualViewport.addEventListener('resize', handler);
  visualViewport.addEventListener('scroll', handler);

  return {
    unsubscribe: () => {
      visualViewport.removeEventListener('resize', handler);
      visualViewport.removeEventListener('scroll', handler);
      if (throttleTimer != null) {
        clearTimeout(throttleTimer);
      }
    },
  };
}
