import { useEffect, useLayoutEffect } from 'react';

const isServer = typeof window === 'undefined';

/**
 * @description
 * `useIsomorphicLayoutEffect` is a hook uses either `useLayoutEffect` or `useEffect` based on the environment.
 * It uses `useLayoutEffect` on the client side and `useEffect` on the server side.
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
