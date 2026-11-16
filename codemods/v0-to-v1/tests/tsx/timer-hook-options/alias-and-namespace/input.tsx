import * as simplikit from 'react-simplikit';
import { useTimeout as useDelay } from 'react-simplikit';

export function Toast() {
  simplikit.useInterval(tick, 16);
  useDelay(hide, 2000);

  return null;
}
