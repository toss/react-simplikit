import { useToggle, isIOS, useKeyboardHeight } from 'react-simplikit';
import type { SafeAreaInset } from 'react-simplikit';

export { isAndroid } from "react-simplikit";

vi.mock('react-simplikit');

export function Sheet({ inset }: { inset: SafeAreaInset }) {
  const [open, toggle] = useToggle();
  const { keyboardHeight } = useKeyboardHeight();

  return <div onClick={toggle}>{isIOS() && open ? keyboardHeight + inset.bottom : 0}</div>;
}
