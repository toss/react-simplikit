import { useInterval, useTimeout } from 'react-simplikit';

import { POLL_MS } from './constants';

export function Poller() {
  useInterval(poll, POLL_MS);
  useInterval(poll, options);
  useTimeout(close, config.closeMs);

  return null;
}
