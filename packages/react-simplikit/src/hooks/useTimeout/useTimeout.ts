import { useEffect } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';

type UseTimeoutOptions = {
  onTimeout: () => void;
  delayMs?: number;
};

/**
 * @description
 * `useTimeout` is a React hook that executes a callback function after a specified delay.
 * It manages `setTimeout` in accordance with the React lifecycle, ensuring cleanup on unmount or when dependencies change.
 *
 * @param {Object} options - Configures the timeout behavior.
 * @param {() => void} options.onTimeout - The function to be executed after the delay.
 * @param {number} [options.delayMs=0] - The time in milliseconds to wait before executing `onTimeout`.
 *
 * @example
 * // Updating a title after a delay
 * import { useTimeout } from 'react-simplikit';
 * import { useState } from 'react';
 *
 * function Example() {
 *   const [title, setTitle] = useState('');
 *
 *   useTimeout({
 *     onTimeout: () => setTitle('Searching for products...'),
 *     delayMs: 2000,
 *   });
 *
 *   useTimeout({
 *     onTimeout: () => setTitle('Almost done...'),
 *     delayMs: 4000,
 *   });
 *
 *   return <div>{title}</div>;
 * }
 */
export function useTimeout({ onTimeout, delayMs = 0 }: UseTimeoutOptions) {
  const preservedCallback = usePreservedCallback(onTimeout);

  useEffect(
    function startTimeout() {
      const timeoutId = setTimeout(preservedCallback, delayMs);
      return () => clearTimeout(timeoutId);
    },
    [delayMs, preservedCallback]
  );
}
