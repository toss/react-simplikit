import { useMemo } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';
import { useRefEffect } from '../useRefEffect/index.ts';

export function useIntersectionObserver<Element extends HTMLElement>(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit
) {
  const preservedCallback = usePreservedCallback(callback);

  const observer = useMemo(() => {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    return new IntersectionObserver(([entry]) => {
      preservedCallback(entry);
    }, options);
  }, [preservedCallback, options]);

  return useRefEffect<Element>(
    element => {
      observer?.observe(element);

      return () => {
        observer?.unobserve(element);
      };
    },
    [preservedCallback, options]
  );
}
