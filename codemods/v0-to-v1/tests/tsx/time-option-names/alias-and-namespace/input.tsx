import * as simplikit from 'react-simplikit';
import { useLongPress as useHold } from 'react-simplikit';

export function Item({ timeThreshold }: { timeThreshold: number }) {
  const ref = simplikit.useImpressionRef({ timeThreshold });
  const handlers = useHold(open, { 'delay': 400 });

  return <simplikit.ImpressionArea timeThreshold={timeThreshold} ref={ref} {...handlers} />;
}
