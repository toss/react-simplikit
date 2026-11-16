import { useBooleanState, useCounter, useStorageState } from 'react-simplikit';

export function Panel() {
  const [isOpen, { setTrue, toggle }] = useBooleanState();
  const [token, { setValue }] = useStorageState('token');
  const [count, { increment }] = useCounter(0);

  return null;
}
