import type { CSSProperties } from 'react';
import { useMemo } from 'react';

import { useKeyboardHeight } from '../useKeyboardHeight/useKeyboardHeight.ts';

type UseAvoidKeyboardOptions = {
  /**
   * Base bottom offset in pixels when keyboard is hidden.
   * @default 0
   */
  safeAreaBottom?: number;
  /**
   * Transition duration in milliseconds for smooth animation.
   * @default 200
   */
  transitionDuration?: number;
  /**
   * Transition timing function for the animation.
   * @default 'ease-out'
   */
  transitionTimingFunction?: CSSProperties['transitionTimingFunction'];
  /**
   * If true, the hook will get the initial keyboard height on mount.
   * @default true
   */
  immediate?: boolean;
};

type UseAvoidKeyboardResult = {
  /**
   * CSS style object to apply to the fixed bottom element.
   * Contains transform and transition properties.
   */
  style: CSSProperties;
};

/**
 * @description
 * `useAvoidKeyboard` is a React hook that helps fixed-bottom elements avoid the on-screen keyboard.
 * It returns a CSS style that can be applied to `position: fixed` elements
 * to smoothly move them above the keyboard when it appears.
 *
 * @param {UseAvoidKeyboardOptions} [options] - Configuration options.
 * @param {number} [options.safeAreaBottom=0] - Base bottom offset in pixels when keyboard is hidden.
 * @param {number} [options.transitionDuration=200] - Transition duration in milliseconds for smooth animation.
 * @param {CSSProperties['transitionTimingFunction']} [options.transitionTimingFunction='ease-out'] - Transition timing function for the animation.
 * @param {boolean} [options.immediate=true] - If true, gets the initial keyboard height on mount.
 *
 * @returns {UseAvoidKeyboardResult} An object containing the `style` property to apply to the fixed bottom element.
 *
 * @example
 * ```tsx
 * function FixedBottomCTA() {
 *   const { style } = useAvoidKeyboard();
 *
 *   return (
 *     <div
 *       style={{
 *         position: 'fixed',
 *         bottom: 0,
 *         left: 0,
 *         right: 0,
 *         ...style,
 *       }}
 *     >
 *       <button>Submit</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With safe area bottom offset (e.g., for iPhone home indicator)
 * function FixedBottomCTA() {
 *   const { style } = useAvoidKeyboard({ safeAreaBottom: 34 });
 *
 *   return (
 *     <div
 *       style={{
 *         position: 'fixed',
 *         bottom: 0,
 *         left: 0,
 *         right: 0,
 *         ...style,
 *       }}
 *     >
 *       <button>Submit</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAvoidKeyboard(options: UseAvoidKeyboardOptions = {}): UseAvoidKeyboardResult {
  const {
    safeAreaBottom = 0,
    transitionDuration = 200,
    transitionTimingFunction = 'ease-out',
    immediate = true,
  } = options;

  const { keyboardHeight } = useKeyboardHeight({ immediate });

  const style = useMemo<CSSProperties>(() => {
    const translateY = keyboardHeight > 0 ? -(keyboardHeight + safeAreaBottom) : 0;

    return {
      transform: `translateY(${translateY}px)`,
      transition: `transform ${transitionDuration}ms ${transitionTimingFunction}`,
    };
  }, [keyboardHeight, safeAreaBottom, transitionDuration, transitionTimingFunction]);

  return { style };
}
