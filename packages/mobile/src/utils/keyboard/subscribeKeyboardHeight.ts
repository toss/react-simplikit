import { isServer } from '../isServer.ts';
import { getKeyboardHeight } from '../keyboard/getKeyboardHeight.ts';

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
 * Subscribes to changes in the on-screen keyboard height.
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
 * @param options - Configuration options
 * @param options.callback - A function that will be called with the updated keyboard height in pixels.
 * @param options.immediate - If true, the callback will be invoked immediately with the current keyboard height.
 * @param options.throttleMs - Throttle interval in milliseconds (default: 16ms).
 *
 * @returns An object containing the unsubscribe function.
 *
 * @example
 * ```ts
 * const { unsubscribe } = subscribeKeyboardHeight({
 *   callback: (height) => {
 *     footer.style.paddingBottom = `${height}px`;
 *   },
 *   immediate: true,
 * });
 *
 * // Later, when cleanup is needed
 * unsubscribe();
 * ```
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
