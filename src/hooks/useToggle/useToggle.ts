import { useCallback, useState } from 'react';

/**
 * @description
 * `useToggle` is a React hook that helps manage a boolean state easily. It provides functionalities to toggle the state.
 * 
 * @param initialValue - The initial value of the state. Defaults to `false`.
 * 
 * @returns a tuple of the form [state, toggle]:
 * - `state`: Current state value
 * - `toggle`: Function to toggle the state
 * 
 * @example
 * function Component() {
 *   const [open, toggle] = useToggle(false);
 * 
 *   return (
 *     <div>
 *       <p>Bottom Sheet state: {open ? 'opened' : 'closed'}</p>
 *       <button onClick={toggle}>Toggle</button>
 *     </div>
 *   );
 * }
 */
export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(b => !b);
  }, []);

  return [value, toggle] as const;
}
