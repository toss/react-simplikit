import { useBooleanState, useCounter } from './hooks';

export function Panel() {
  const [isOpen, open, close] = useBooleanState();
  const { count, increment } = useCounter(0);

  return null;
}
