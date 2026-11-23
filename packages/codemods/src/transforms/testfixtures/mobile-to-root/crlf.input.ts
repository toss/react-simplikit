import { isAndroid } from '@react-simplikit/mobile';
import { useToggle } from 'react-simplikit';

export const a = isAndroid() && useToggle;
