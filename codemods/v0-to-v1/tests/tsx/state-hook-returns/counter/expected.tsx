import { useCounter } from 'react-simplikit';

export function Stepper() {
  const [count, { increment, decrement }] = useCounter(0, { min: 0 });
  const [page, { setCount: setPage }] = useCounter(1);
  const [, { reset }] = useCounter();
  const [total] = useCounter(10);

  return null;
}
