import { useReducer } from 'react';

/**
 * @description
 * `useToggle` is a React hook that simplifies managing a boolean state.
 * It provides a function to toggle the state between `true` and `false`.
 *
 * @param {boolean} [initialValue=false] - The initial state value. Defaults to `false`.
 *
 * @returns {[boolean, () => void]} A tuple:
 * - `state`: The current state value.
 * - `toggle`: A function to toggle the state.
 *
 * @example
 * import { useToggle } from 'reactive-kit';
 *
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
  return useReducer(toggle, initialValue);
}

const toggle = (state: boolean) => !state;
