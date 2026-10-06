import { useEffect, useLayoutEffect } from 'react';

const isServer = typeof window === 'undefined';

/**
 * @description
 * `useIsomorphicLayoutEffect` is a React hook that runs `useLayoutEffect` in the browser without triggering its warning during server-side rendering.
 * During SSR, there is no DOM to synchronously measure or mutate, so React warns about using `useLayoutEffect`.
 *
 * React does not run effects on the server, so the effect only runs in the browser. On the server, this hook is `useEffect`, which React skips.
 * It exists only to avoid the warning: it does not run anything on the server, and it does not make the server output match the client.
 *
 * In the browser, it runs synchronously after DOM updates but before paint, making it ideal for:
 *
 * - Measuring DOM elements after render
 * - Applying DOM changes before paint
 * - Preventing UI flashes or layout shifts
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
