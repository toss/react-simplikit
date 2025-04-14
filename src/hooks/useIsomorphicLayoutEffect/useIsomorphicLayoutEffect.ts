import { useEffect, useLayoutEffect } from 'react';

const isServer = typeof window === 'undefined';

/**
 * @description
 * `useIsomorphicLayoutEffect` is a hook uses either `useLayoutEffect` or `useEffect` based on the environment.
 * It uses `useLayoutEffect` on the client side and `useEffect` on the server side.
 *
 * This hook is useful when you need the behavior of `useLayoutEffect` (which runs synchronously after DOM mutations
 * but before the browser paints) for browser environments, while avoiding the warning that occurs when `useLayoutEffect`
 * is used during server-side rendering (SSR).
 *
 * During SSR, there is no DOM to synchronously measure or mutate, so React warns about using `useLayoutEffect`.
 * This hook safely handles both client and server environments without warnings.
 *
 * Use this hook when you need to:
 * - Measure DOM nodes or their properties immediately after render
 * - Perform DOM mutations that should be visible before browser paint
 * - Handle UI flashes or layout shifts that would otherwise be visible with `useEffect`
 * - Make your component work seamlessly in both client and server environments
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
