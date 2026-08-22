import { type DependencyList, type EffectCallback, useCallback, useEffect, useRef } from 'react';

/**
 * @description
 * `useConditionalEffect` is a React hook that conditionally executes effects based on a predicate function.
 * This provides more control over when effects run beyond just dependency changes.
 *
 * @param {EffectCallback} effect - The effect callback to run.
 * @param {DependencyList} deps - Dependencies array, similar to useEffect.
 * @param {(prevDeps: T | undefined, currentDeps: T) => boolean} condition - Function that determines if the effect should run based on previous and current deps.
 * - On the initial render, `prevDeps` will be `undefined`. Your `condition` function should handle this case.
 * - If you want your effect to run on the initial render, return `true` when `prevDeps` is `undefined`.
 * - If you don't want your effect to run on the initial render, return `false` when `prevDeps` is `undefined`.
 *
 * @example
 * import { useConditionalEffect } from 'react-simplikit';
 *
 * function Component() {
 *   const [count, setCount] = useState(0);
 *
 *   // Only run effect when count increases
 *   useConditionalEffect(
 *     () => {
 *       console.log(`Count increased to ${count}`);
 *     },
 *     [count],
 *     (prevDeps, currentDeps) => {
 *       // Only run when count is defined and has increased
 *       return prevDeps && currentDeps[0] > prevDeps[0];
 *     }
 *   );
 *
 *   return (
 *     <button onClick={() => setCount(prev => prev + 1)}>
 *       Increment: {count}
 *     </button>
 *   );
 * }
 *
 */
export function useConditionalEffect<T extends DependencyList>(
  effect: EffectCallback,
  deps: T,
  condition: (prevDeps: T | undefined, currentDeps: T) => boolean
): void {
  // Without `'use no memo'`, React Compiler throws when `panicThreshold` is not `'none'`:
  // it rejects `useCallback(condition, deps)` because `deps` is a caller-supplied variable
  // rather than an array literal, and `condition` is not an inline function expression.
  'use no memo';

  const prevDepsRef = useRef<T | undefined>(undefined);
  /* eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/use-memo -- `deps` is
     the caller's dependency list, so it can be neither verified nor written as a literal. */
  const memoizedCondition = useCallback(condition, deps);

  if (deps.length === 0) {
    console.warn(
      'useConditionalEffect received an empty dependency array. ' +
        'This may indicate missing dependencies and could lead to unexpected behavior.'
    );
  }

  /* eslint-disable-next-line react-hooks/refs -- comparing this render's deps against the
     previous ones has to happen during render; that comparison is the hook's contract. */
  const shouldRun = memoizedCondition(prevDepsRef.current, deps);

  useEffect(() => {
    if (shouldRun) {
      const cleanup = effect();
      prevDepsRef.current = deps;
      return cleanup;
    }

    prevDepsRef.current = deps;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
