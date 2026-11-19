import {
  useDebounce,
  useDebouncedCallback,
  useNetworkStatus,
  useThrottle,
  useThrottledCallback,
  useToggle,
} from 'react-simplikit';

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

function useDebouncedCallbackLog() {
  return useDebouncedCallback({ callback: (query: string) => console.log(query), debounceMs: 300 });
}

function useThrottledCallbackLog() {
  return useThrottledCallback({ callback: (y: number) => console.log(y), throttleMs: 16 });
}

export { toggleReturn, useDebouncedCallbackLog, useDebouncedLog, useThrottledCallbackLog, useThrottledLog };
export type { NetworkStatusReturn };
