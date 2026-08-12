import { useNetworkStatus } from '@react-simplikit/mobile';
import { useToggle } from 'react-simplikit';

type UseToggleReturn = ReturnType<typeof useToggle>;
const toggleReturn: [boolean, () => void] = undefined as unknown as UseToggleReturn;

type NetworkStatusReturn = ReturnType<typeof useNetworkStatus>;

export { toggleReturn };
export type { NetworkStatusReturn };
