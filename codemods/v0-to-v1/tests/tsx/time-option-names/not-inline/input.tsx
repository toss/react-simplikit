import { ImpressionArea, useDebouncedCallback, useLongPress } from 'react-simplikit';

export function Item(props: Props) {
  const search = useDebouncedCallback(options);
  const handlers = useLongPress(open, { ...base, delay: 400 });

  return <ImpressionArea {...props} />;
}
