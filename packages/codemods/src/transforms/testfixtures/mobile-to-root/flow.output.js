// @flow
import { isIOS } from 'react-simplikit';
type Props = {| name: string |};
export function f(p: Props): boolean { return isIOS(); }
