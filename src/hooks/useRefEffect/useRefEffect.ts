import { DependencyList, useCallback, useRef } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';

export type CleanupCallback = () => void;

export function useRefEffect<Element extends HTMLElement = HTMLElement>(
  callback: (element: Element) => CleanupCallback | void,
  deps: DependencyList
) {
  const preservedCallback = usePreservedCallback(callback);
  const cleanupCallbackRef = useRef<CleanupCallback>(() => {});

  const effect = useCallback(
    (element: Element | null) => {
      cleanupCallbackRef.current();
      cleanupCallbackRef.current = () => {};

      if (element == null) {
        return;
      }

      const cleanup = preservedCallback(element);

      if (typeof cleanup === 'function') {
        cleanupCallbackRef.current = cleanup;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [preservedCallback, ...deps]
  );

  return effect;
}
