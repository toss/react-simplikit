import { useCallback, useEffect, useRef } from 'react';

type OneOrMore<T> = T | T[];

export function useOutsideClickEffect(container: OneOrMore<HTMLElement | null>, callback: () => void) {
  const containers = useRef<HTMLElement[]>([]);

  const handleDocumentClick = usePreservedCallback(({ target }: MouseEvent | TouchEvent) => {
    if (target === null) {
      return;
    }

    if (containers.current.length === 0) {
      return;
    }

    if (containers.current.some(x => x.contains(target as Node))) {
      return;
    }

    callback();
  });

  useEffect(() => {
    containers.current = [container].flat(1).filter(item => item != null);
  }, [container]);

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [handleDocumentClick]);
}

function usePreservedCallback<Callback extends (...args: any[]) => any>(callback: Callback) {
  const callbackRef = useRef<Callback>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: any[]) => {
    return callbackRef.current(...args);
  }, []) as Callback;
}
