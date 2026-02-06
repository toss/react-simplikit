import { isServer } from '../isServer.ts';

export type SafeAreaInset = {
  /** Top safe area inset in pixels (notch, Dynamic Island, or status bar) */
  top: number;
  /** Bottom safe area inset in pixels (home indicator on Face ID devices) */
  bottom: number;
  /** Left safe area inset in pixels (rounded corners in landscape mode) */
  left: number;
  /** Right safe area inset in pixels (rounded corners in landscape mode) */
  right: number;
};

/**
 * Returns all safe area insets in pixels as an object.
 *
 * This function reads the CSS `env(safe-area-inset-*)` values by creating
 * a temporary DOM element and reading its computed style.
 *
 * Safe area insets account for device-specific UI elements:
 * - **top**: Notch, Dynamic Island, or status bar
 * - **bottom**: Home indicator on Face ID devices
 * - **left/right**: Rounded corners in landscape mode
 *
 * Typical values (iPhone with Face ID, portrait mode):
 * - top: 47-59px (notch/Dynamic Island)
 * - bottom: 34px (home indicator)
 * - left/right: 0px
 *
 * @returns Object containing safe area insets for all four sides, or all 0 if not available.
 *
 * @example
 * ```ts
 * const { top, bottom, left, right } = getSafeAreaInset();
 *
 * header.style.paddingTop = `${top}px`;
 * footer.style.paddingBottom = `${bottom}px`;
 * ```
 */
export function getSafeAreaInset(): SafeAreaInset {
  if (isServer()) {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }

  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.setProperty('padding-top', 'env(safe-area-inset-top)');
  div.style.setProperty('padding-bottom', 'env(safe-area-inset-bottom)');
  div.style.setProperty('padding-left', 'env(safe-area-inset-left)');
  div.style.setProperty('padding-right', 'env(safe-area-inset-right)');
  document.body.appendChild(div);

  const computedStyle = window.getComputedStyle(div);
  const inset: SafeAreaInset = {
    top: parseFloat(computedStyle.getPropertyValue('padding-top')) || 0,
    bottom: parseFloat(computedStyle.getPropertyValue('padding-bottom')) || 0,
    left: parseFloat(computedStyle.getPropertyValue('padding-left')) || 0,
    right: parseFloat(computedStyle.getPropertyValue('padding-right')) || 0,
  };

  document.body.removeChild(div);
  return inset;
}
