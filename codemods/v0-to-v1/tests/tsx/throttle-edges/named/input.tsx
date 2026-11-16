import { useThrottle, useThrottledCallback } from 'react-simplikit';

export function Editor() {
  const save = useThrottle(persist, 1000, { edges: ['leading'] });
  const scroll = useThrottle(track, 16, { edges: ["leading", "trailing"] });
  const onChange = useThrottledCallback({ onChange: setDraft, throttleMs: 500, edges: ['trailing'] });
  const onIdle = useThrottledCallback({ onChange: setIdle, throttleMs: 500, 'edges': [] });
  const plain = useThrottle(track, 16);

  return null;
}
