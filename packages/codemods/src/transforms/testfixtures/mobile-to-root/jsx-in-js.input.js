import { isIOS } from '@react-simplikit/mobile';
export const El = () => <div>{isIOS() ? 'ios' : 'other'}</div>;
