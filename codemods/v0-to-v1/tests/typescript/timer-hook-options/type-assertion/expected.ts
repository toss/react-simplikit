import { useTimeout } from 'react-simplikit';

const delayMs = <number>config.delay;
useTimeout({ onTimeout: close, delayMs: 300 });
