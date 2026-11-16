import { useBooleanState, useCounter, useStorageState } from 'react-simplikit';

export function Panel() {
  const flag = useBooleanState();
  const counter = useCounter(0);
  const [token, ...actions] = useStorageState('token');
  const { count = 0, ...rest } = useCounter(1);

  return <Child state={useBooleanState()} />;
}
