import { useToggle, isAndroid } from 'react-simplikit';

export const a = isAndroid() && useToggle;
