import { useInterval, useTimeout } from 'usehooks-ts';

export function Poller() {
  useInterval(poll, 1000);
  useTimeout(close, 3000);

  return null;
}
