import { useThrottle } from 'react-simplikit';

const wait = <number>config.wait;
export const save = useThrottle(persist, wait, { leading: true, trailing: false });
