import { useEffect, useState } from 'react';

import { useDebounce } from '../useDebounce/index.ts';

type DebounceOptions = {
  leading?: boolean;
  trailing?: boolean;
};

export function useDebouncedValue<T>(
  value: T,
  wait: number,
  { leading = false, trailing = true }: DebounceOptions = {}
): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const debounced = useDebounce((next: T) => setDebouncedValue(() => next), wait, { leading, trailing });

  useEffect(
    function forwardValue() {
      debounced(value);
    },
    [value, debounced]
  );

  return debouncedValue;
}
