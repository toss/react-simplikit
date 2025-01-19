import { useCallback, useEffect, useRef } from 'react';

import { debounce } from '../useDebounce/debounce.ts';
import { usePreservedCallback } from '../usePreservedCallback/index.ts';

export function useDebouncedCallback({
  onChange,
  timeThreshold,
}: {
  onChange: (newValue: boolean) => void;
  timeThreshold: number;
}) {
  const handleChange = usePreservedCallback(onChange);
  const ref = useRef({ value: false, clearPreviousDebounce: () => {} });

  useEffect(() => {
    const current = ref.current;
    return () => {
      current.clearPreviousDebounce();
    };
  }, []);

  return useCallback(
    (nextValue: boolean) => {
      if (nextValue === ref.current.value) {
        return;
      }

      const debounced = debounce(() => {
        handleChange(nextValue);

        ref.current.value = nextValue;
      }, timeThreshold);

      ref.current.clearPreviousDebounce();

      debounced();

      ref.current.clearPreviousDebounce = debounced.cancel;
    },
    [handleChange, timeThreshold]
  );
}
