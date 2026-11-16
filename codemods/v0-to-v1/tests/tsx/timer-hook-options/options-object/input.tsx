import { useInterval } from 'react-simplikit';

export function Poller({ enabled }: { enabled: boolean }) {
  useInterval(poll, { delay: 1000, immediate: true });
  useInterval(poll, {
    delay: POLL_MS,
    enabled,
  });
  useInterval(poll, { ...base, delay: 1000 });

  return null;
}
