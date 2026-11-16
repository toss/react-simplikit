import { ImpressionArea, useDebouncedCallback, useLongPress } from 'react-simplikit';

export function Item() {
  const search = useDebouncedCallback({ onChange: setQuery, debounceMs: 300 });
  const handlers = useLongPress(open, { delayMs: 400 });

  return <ImpressionArea timeThresholdMs={500} onClick={search} />;
}
