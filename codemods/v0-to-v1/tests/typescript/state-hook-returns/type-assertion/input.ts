import { useBooleanState } from 'react-simplikit';

const initial = <boolean>config.open;
export const [isOpen, open, close] = useBooleanState(initial);
