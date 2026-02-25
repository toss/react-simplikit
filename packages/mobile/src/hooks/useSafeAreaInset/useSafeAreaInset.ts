import { startTransition, useCallback, useEffect, useState } from 'react';

import { getSafeAreaInset, type SafeAreaInset } from '../../utils/getSafeAreaInset/index.ts';
import { isServer } from '../../utils/isServer/index.ts';

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
  const [inset, setInset] = useState<SafeAreaInset>(() => getSafeAreaInset());

  const updateInset = useCallback(() => {
    startTransition(() => {
      setInset(getSafeAreaInset());
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
