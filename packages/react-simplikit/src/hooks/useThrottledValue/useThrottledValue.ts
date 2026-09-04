import { useEffect, useRef, useState } from 'react';

import { useThrottle } from '../useThrottle/index.ts';

type ThrottleOptions = {
  leading?: boolean;
  trailing?: boolean;
};

type Edge = 'leading' | 'trailing';

export function useThrottledValue<T>(
  value: T,
  wait: number,
  { leading = true, trailing = true }: ThrottleOptions = {}
): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const throttled = useThrottle((next: T) => setThrottledValue(() => next), wait, {
    edges: toEdges(leading, trailing),
  });
  const lastForwardedRef = useRef(value);

  useEffect(
    function forwardChangedValue() {
      const unchanged = Object.is(lastForwardedRef.current, value);
      const settled = Object.is(value, throttledValue);
      if (unchanged && settled) {
        return;
      }

      lastForwardedRef.current = value;
      throttled(value);
    },
    [value, throttledValue, throttled]
  );

  return throttledValue;
}

function toEdges(leading: boolean, trailing: boolean): Edge[] {
  const edges: Edge[] = [];
  if (leading) {
    edges.push('leading');
  }
  if (trailing) {
    edges.push('trailing');
  }
  return edges;
}
