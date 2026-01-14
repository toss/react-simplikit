import { isServer } from '../isServer.ts';

import { getKeyboardHeight } from './getKeyboardHeight.ts';

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
 * @param options - Configuration options
 * @param options.callback - A function that will be called with the updated keyboard height in pixels.
 * @param options.immediate - If true, the callback will be invoked immediately with the current keyboard height.
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
}: SubscribeKeyboardHeightOptions): SubscribeKeyboardHeightResult {
  if (isServer()) {
    return { unsubscribe: () => {} };
  }

  const handler = () => callback(getKeyboardHeight());

  const visualViewport = window.visualViewport;
  if (!visualViewport) {
    return { unsubscribe: () => {} };
  }

  if (immediate) {
    handler();
  }

  visualViewport.addEventListener('resize', handler);
  visualViewport.addEventListener('scroll', handler);

  return {
    unsubscribe: () => {
      visualViewport.removeEventListener('resize', handler);
      visualViewport.removeEventListener('scroll', handler);
    },
  };
}
