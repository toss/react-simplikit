import * as simplikit from 'react-simplikit';
import { useBooleanState as useFlag } from 'react-simplikit';

export function Panel() {
  const [visible, { setTrue: show, setFalse: hide }] = useFlag();
  const [count, { increment }] = simplikit.useCounter(0);

  return null;
}
