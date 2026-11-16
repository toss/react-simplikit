import * as simplikit from 'react-simplikit';
import { useTimeout as useDelay } from 'react-simplikit';

export function Toast() {
  simplikit.useInterval({ onTick: tick, delayMs: 16 });
  useDelay({ onTimeout: hide, delayMs: 2000 });

  return null;
}
