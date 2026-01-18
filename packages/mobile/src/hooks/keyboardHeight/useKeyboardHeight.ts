import { useEffect, useState } from 'react';

import { subscribeKeyboardHeight } from '../../utils/keyboard/subscribeKeyboardHeight.ts';

type UseKeyboardHeightOptions = {
  /**
   * If true, the hook will get the initial keyboard height on mount.
   * @default true
   */
  immediate?: boolean;
};

type UseKeyboardHeightResult = {
  /**
   * The current keyboard height in pixels.
   */
  keyboardHeight: number;
};

/**
 * React hook to track the on-screen keyboard height.
 *
 * Returns an object containing the current keyboard height in pixels,
 * which updates automatically when the keyboard appears, disappears, or changes size.
 *
 * @param options - Configuration options
 * @param options.immediate - If true, gets the initial keyboard height on mount (default: true)
 * @returns An object containing the current keyboard height
 *
 * @example
 * ```tsx
 * function ChatInput() {
 *   const { keyboardHeight } = useKeyboardHeight();
 *
 *   return (
 *     <div style={{ paddingBottom: `${keyboardHeight}px` }}>
 *       <input type="text" placeholder="Type a message..." />
 *     </div>
 *   );
 * }
 * ```
 */
export function useKeyboardHeight(options: UseKeyboardHeightOptions = {}): UseKeyboardHeightResult {
  const { immediate = true } = options;

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(
    function subscribeToKeyboardHeight() {
      const { unsubscribe } = subscribeKeyboardHeight({
        callback: setKeyboardHeight,
        immediate,
      });

      return unsubscribe;
    },
    [immediate]
  );

  return { keyboardHeight };
}
