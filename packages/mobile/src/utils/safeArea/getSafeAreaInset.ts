import { isServer } from '../isServer.ts';

type SafeAreaPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Returns the safe area inset for the specified position in pixels.
 *
 * This function reads the CSS `env(safe-area-inset-*)` value by creating
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
 * @param position - The position to get the inset for ('top', 'bottom', 'left', 'right')
 * @returns The safe area inset in pixels, or 0 if not available.
 *
 * @example
 * ```ts
 * const topInset = getSafeAreaInset('top');
 * const bottomInset = getSafeAreaInset('bottom');
 *
 * header.style.paddingTop = `${topInset}px`;
 * footer.style.paddingBottom = `${bottomInset}px`;
 * ```
 */
export function getSafeAreaInset(position: SafeAreaPosition): number {
  if (isServer()) {
    return 0;
  }

  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.setProperty(`padding-${position}`, `env(safe-area-inset-${position})`);
  document.body.appendChild(div);

  const computedStyle = window.getComputedStyle(div);
  const value = parseFloat(computedStyle.getPropertyValue(`padding-${position}`)) || 0;

  document.body.removeChild(div);
  return value;
}
