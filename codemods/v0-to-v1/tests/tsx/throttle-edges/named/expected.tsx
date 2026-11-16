import { useThrottle, useThrottledCallback } from 'react-simplikit';

export function Editor() {
  const save = useThrottle(persist, 1000, { leading: true, trailing: false });
  const scroll = useThrottle(track, 16, { leading: true, trailing: true });
  const onChange = useThrottledCallback({ onChange: setDraft, throttleMs: 500, leading: false, trailing: true });
  const onIdle = useThrottledCallback({ onChange: setIdle, throttleMs: 500, leading: false, trailing: false });
  const plain = useThrottle(track, 16);

  return null;
}
