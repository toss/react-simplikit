import { useInterval, useTimeout } from 'react-simplikit';

export function Poller() {
  useInterval({ onTick: poll, delayMs: 1000 });
  useInterval(intervalOptions);
  useTimeout({ onTimeout: close, delayMs: 3000 });

  return null;
}
