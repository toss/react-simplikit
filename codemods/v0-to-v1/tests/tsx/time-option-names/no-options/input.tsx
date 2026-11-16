import { useAvoidKeyboard, useLongPress } from 'react-simplikit';

export function Item() {
  const { style } = useAvoidKeyboard();
  const handlers = useLongPress(open);

  return <div style={style} {...handlers} />;
}
