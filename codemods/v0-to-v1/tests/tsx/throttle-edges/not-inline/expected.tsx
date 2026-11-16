import { useThrottle, useThrottledCallback } from 'react-simplikit';

export function Editor({ edges }: Props) {
  const save = useThrottle(persist, 1000, { edges });
  const scroll = useThrottle(track, 16, throttleOptions);
  const onChange = useThrottledCallback({ ...base, edges: [EDGE] });

  return null;
}
