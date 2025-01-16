import { useEffect } from 'react';

import { usePreservedCallback } from '../usePreservedCallback/index.ts';

type IntervalOptions =
  | number
  | {
      delay: number;
      immediate?: boolean;
      enabled?: boolean;
    };

export function useInterval(callback: () => void, options: IntervalOptions) {
  const delay = typeof options === 'number' ? options : options.delay;
  const immediate = typeof options === 'number' ? false : options.immediate;
  const enabled = typeof options === 'number' ? true : (options.enabled ?? true);

  const preservedCallback = usePreservedCallback(callback);

  useEffect(() => {
    if (immediate === true && enabled) {
      preservedCallback();
    }
  }, [immediate, preservedCallback, enabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const id = window.setInterval(preservedCallback, delay);
    return () => window.clearInterval(id);
  }, [delay, preservedCallback, enabled]);
}
