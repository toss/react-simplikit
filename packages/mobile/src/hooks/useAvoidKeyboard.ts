import type { CSSProperties } from 'react';
import { useMemo } from 'react';

import { useKeyboardHeight } from './keyboardHeight/useKeyboardHeight.ts';

type UseAvoidKeyboardOptions = {
  /**
   * Base bottom offset in pixels when keyboard is hidden.
   * @default 0
   */
  baseBottom?: number;
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
  /**
   * Current keyboard height in pixels.
   */
  keyboardHeight: number;
  /**
   * Whether the keyboard is currently visible.
   */
  isKeyboardVisible: boolean;
};

/**
 * React hook to help fixed-bottom elements avoid the on-screen keyboard.
 *
 * Returns style properties that can be applied to position:fixed elements
 * to smoothly move them above the keyboard when it appears.
 *
 * @param options - Configuration options
 * @param options.baseBottom - Base bottom offset in pixels when keyboard is hidden (default: 0)
 * @param options.transitionDuration - Transition duration in milliseconds (default: 200)
 * @param options.transitionTimingFunction - Transition timing function (default: 'ease-out')
 * @param options.immediate - If true, gets the initial keyboard height on mount (default: true)
 *
 * @returns An object containing style, keyboardHeight, and isKeyboardVisible
 *
 * @example
 * ```tsx
 * function FixedBottomCTA() {
 *   const { style, isKeyboardVisible } = useAvoidKeyboard();
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
 * // With base bottom offset (e.g., for safe area)
 * function FixedBottomCTA() {
 *   const { style } = useAvoidKeyboard({ baseBottom: 20 });
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
  const { baseBottom = 0, transitionDuration = 200, transitionTimingFunction = 'ease-out', immediate = true } = options;

  const keyboardHeight = useKeyboardHeight({ immediate });
  const isKeyboardVisible = keyboardHeight > 0;

  const style = useMemo<CSSProperties>(() => {
    const translateY = -(keyboardHeight + baseBottom);

    return {
      transform: `translateY(${translateY}px)`,
      transition: `transform ${transitionDuration}ms ${transitionTimingFunction}`,
    };
  }, [keyboardHeight, baseBottom, transitionDuration, transitionTimingFunction]);

  return {
    style,
    keyboardHeight,
    isKeyboardVisible,
  };
}
