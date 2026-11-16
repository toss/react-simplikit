import { useBooleanState } from 'react-simplikit';

const initial = <boolean>config.open;
export const [isOpen, { setTrue: open, setFalse: close }] = useBooleanState(initial);
