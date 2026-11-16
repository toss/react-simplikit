import { ImpressionArea, useLongPress } from './local';

export function Item() {
  const handlers = useLongPress(open, { delay: 400 });

  return <ImpressionArea timeThreshold={500} {...handlers} />;
}
