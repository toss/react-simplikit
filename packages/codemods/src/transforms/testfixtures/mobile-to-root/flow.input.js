// @flow
import { isIOS } from '@react-simplikit/mobile';
type Props = {| name: string |};
export function f(p: Props): boolean { return isIOS(); }
