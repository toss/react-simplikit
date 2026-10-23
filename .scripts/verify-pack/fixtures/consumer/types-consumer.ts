import { useDebounce, useNetworkStatus, useThrottle, useToggle } from 'react-simplikit';

type UseToggleReturn = ReturnType<typeof useToggle>;
const toggleReturn: [boolean, () => void] = undefined as unknown as UseToggleReturn;

type NetworkStatusReturn = ReturnType<typeof useNetworkStatus>;

// Inferred return types fail declaration emit (TS2742) when they reference a type the package entry does not export
function useThrottledLog() {
  return useThrottle((y: number) => console.log(y), 16);
}

function useDebouncedLog() {
  return useDebounce((query: string) => console.log(query), 300);
}

export { toggleReturn, useDebouncedLog, useThrottledLog };
export type { NetworkStatusReturn };
