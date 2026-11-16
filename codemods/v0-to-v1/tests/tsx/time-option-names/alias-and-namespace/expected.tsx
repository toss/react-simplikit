import * as simplikit from 'react-simplikit';
import { useLongPress as useHold } from 'react-simplikit';

export function Item({ timeThreshold }: { timeThreshold: number }) {
  const ref = simplikit.useImpressionRef({ timeThresholdMs: timeThreshold });
  const handlers = useHold(open, { delayMs: 400 });

  return <simplikit.ImpressionArea timeThresholdMs={timeThreshold} ref={ref} {...handlers} />;
}
