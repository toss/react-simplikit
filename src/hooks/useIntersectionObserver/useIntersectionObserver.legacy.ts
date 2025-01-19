/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useMemo } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';
import { useRefEffect } from '../useRefEffect/useRefEffect.legacy.ts';

export function useIntersectionObserver<Element extends HTMLElement>(
  _callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit
) {
  const callback = usePreservedCallback(_callback);
  const observer = useMemo(() => {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) {
        return;
      }

      callback(entry);
    }, options);

    return observer;
  }, [callback, options]);

  const ref = useRefEffect<Element>(
    element => {
      observer?.observe(element);

      return () => {
        observer?.unobserve(element);
      };
    },
    [callback, options]
  );

  return ref;
}
