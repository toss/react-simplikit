import { getKeyboardHeight } from './getKeyboardHeight.ts';

/**
 * Checks whether the on-screen keyboard is currently visible.
 *
 * This function uses `getKeyboardHeight()` internally and returns `true`
 * if the keyboard height is greater than 0.
 *
 * @returns {boolean} `true` if the keyboard is visible, `false` otherwise.
 *
 * @example
 * ```ts
 * if (isKeyboardVisible()) {
 *   console.log('Keyboard is open');
 * } else {
 *   console.log('Keyboard is closed');
 * }
 * ```
 *
 * @example
 * ```ts
 * // Conditionally show/hide elements based on keyboard visibility
 * const showFloatingButton = !isKeyboardVisible();
 * ```
 */
export function isKeyboardVisible(): boolean {
  const keyboardHeight = getKeyboardHeight();
  return keyboardHeight > 0;
}
