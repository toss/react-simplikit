import { useInterval, useTimeout } from 'react-simplikit';

const POLL_MS = 5 * 1000;

export function Poller() {
  useInterval(poll, 1000);
  useInterval(() => poll(), POLL_MS);
  useInterval(poll, (60 * 1000));
  useTimeout(close, 3000);
  useTimeout(() => close());

  return null;
}
