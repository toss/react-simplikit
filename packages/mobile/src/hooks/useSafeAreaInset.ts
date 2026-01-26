import { startTransition, useCallback, useEffect, useState } from 'react';

import { isServer } from '../utils/isServer.ts';
import { getSafeAreaInset } from '../utils/safeArea/getSafeAreaInset.ts';

type SafeAreaInset = {
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
 * React hook to track safe area inset changes
 *
 * Returns the safe area insets that automatically update when the screen
 * orientation changes (e.g., portrait to landscape).
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
 * @returns Object containing safe area insets for all four sides
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const safeArea = useSafeAreaInset();
 *
 *   return (
 *     <div style={{
 *       paddingTop: safeArea.top,
 *       paddingBottom: safeArea.bottom,
 *       paddingLeft: safeArea.left,
 *       paddingRight: safeArea.right,
 *     }}>
 *       Content that respects safe areas
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Automatically updates when screen rotates
 * function RotationAwareHeader() {
 *   const { top, left, right } = useSafeAreaInset();
 *
 *   return (
 *     <header style={{
 *       paddingTop: top,
 *       paddingLeft: left,
 *       paddingRight: right,
 *     }}>
 *       Header content
 *     </header>
 *   );
 * }
 * ```
 */
export function useSafeAreaInset(): SafeAreaInset {
  const [inset, setInset] = useState<SafeAreaInset>(() => getSafeAreaInsetAll());

  const updateInset = useCallback(() => {
    startTransition(() => {
      setInset(getSafeAreaInsetAll());
    });
  }, []);

  useEffect(
    function handleOrientationChange() {
      if (isServer()) {
        return;
      }

      // Listen to resize event for orientation changes
      window.addEventListener('resize', updateInset);

      // Also listen to orientationchange for better compatibility on some devices
      window.addEventListener('orientationchange', updateInset);

      return function cleanup() {
        window.removeEventListener('resize', updateInset);
        window.removeEventListener('orientationchange', updateInset);
      };
    },
    [updateInset]
  );

  return inset;
}

function getSafeAreaInsetAll(): SafeAreaInset {
  if (isServer()) {
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }

  return {
    top: getSafeAreaInset('top'),
    bottom: getSafeAreaInset('bottom'),
    left: getSafeAreaInset('left'),
    right: getSafeAreaInset('right'),
  };
}

