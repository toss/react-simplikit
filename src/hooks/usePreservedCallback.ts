import { useCallback, useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function usePreservedCallback<Argument = any, ReturnValue = unknown>(
  callback: (...args: Argument[]) => ReturnValue
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: Argument[]) => {
    return callbackRef.current(...args);
  }, []);
}
