import { useDebouncedCallback } from 'react-simplikit';

const debounceMs = <number>config.wait;
export const search = useDebouncedCallback({ onChange: setQuery, debounceMs: debounceMs });
