import { useInterval, useTimeout } from 'react-simplikit';

const POLL_MS = 5 * 1000;

export function Poller() {
  useInterval({ onTick: poll, delayMs: 1000 });
  useInterval({ onTick: () => poll(), delayMs: POLL_MS });
  useInterval({ onTick: poll, delayMs: (60 * 1000) });
  useTimeout({ onTimeout: close, delayMs: 3000 });
  useTimeout({ onTimeout: () => close() });

  return null;
}
