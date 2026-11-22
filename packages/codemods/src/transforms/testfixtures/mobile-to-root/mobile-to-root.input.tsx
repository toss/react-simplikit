import { useToggle } from 'react-simplikit';
import { isIOS, useKeyboardHeight } from '@react-simplikit/mobile';
import type { SafeAreaInset } from '@react-simplikit/mobile';

export { isAndroid } from "@react-simplikit/mobile";

vi.mock('@react-simplikit/mobile');

export function Sheet({ inset }: { inset: SafeAreaInset }) {
  const [open, toggle] = useToggle();
  const { keyboardHeight } = useKeyboardHeight();

  return <div onClick={toggle}>{isIOS() && open ? keyboardHeight + inset.bottom : 0}</div>;
}
