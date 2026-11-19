import { useDoubleClick } from 'react-simplikit';

const delayMs = <number>config.delay;
export const handleClick = useDoubleClick({ delay: delayMs, doubleClick: zoom });
