import { useInterval } from 'react-simplikit';

export function Poller({ enabled }: { enabled: boolean }) {
  useInterval({ onTick: poll, delayMs: 1000, immediate: true });
  useInterval({
    onTick: poll,
    delayMs: POLL_MS,
    enabled,
  });
  useInterval({ onTick: poll, ...base, delayMs: 1000 });

  return null;
}
