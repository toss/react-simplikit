import { useEffect, useLayoutEffect } from 'react';

const isServer = typeof window === 'undefined';

/**
 * @description
 * `useIsomorphicLayoutEffect` is a React hook that provides the behavior of `useLayoutEffect` without triggering warnings during server-side rendering.
 * During SSR, there is no DOM to synchronously measure or mutate, so React warns about using `useLayoutEffect`.
 *
 * This hook runs synchronously after DOM updates but before paint, making it ideal for:
 *
 * - Measuring DOM elements after render
 * - Applying DOM changes before paint
 * - Preventing UI flashes or layout shifts
 * - Supporting both client and server environments safely
 *
 * @param {React.EffectCallback} effect - The effect function.
 * @param {React.DependencyList} [deps] - An optional array of dependencies.
 *
 * @example
 * useIsomorphicLayoutEffect(() => {
 *   // Code to be executed during the layout phase on the client side
 * }, [dep1, dep2, ...]);
 */
export const useIsomorphicLayoutEffect = isServer ? useEffect : useLayoutEffect;
