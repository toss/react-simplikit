import * as simplikit from 'react-simplikit';
import { useThrottle as useLimit } from 'react-simplikit';

export function Editor() {
  const save = useLimit(persist, 1000, { leading: false, trailing: true });
  const onChange = simplikit.useThrottledCallback({ onChange: setDraft, throttleMs: 500, leading: true, trailing: false });

  return null;
}
