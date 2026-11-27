import { isIOS } from 'react-simplikit';
export const El = () => <div>{isIOS() ? 'ios' : 'other'}</div>;
