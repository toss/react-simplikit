import * as simplikit from 'react-simplikit';
import { useBooleanState as useFlag } from 'react-simplikit';

export function Panel() {
  const [visible, show, hide] = useFlag();
  const { count, increment } = simplikit.useCounter(0);

  return null;
}
