import { useThrottle, useThrottledCallback } from 'react-simplikit';

export function Editor() {
  const save = useThrottle(persist, 1000, { leading: true, trailing: false });
  const onChange = useThrottledCallback({ onChange: setDraft, throttleMs: 500, trailing: false });

  return null;
}
