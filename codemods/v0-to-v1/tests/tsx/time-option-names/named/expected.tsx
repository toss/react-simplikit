import { ImpressionArea, useAvoidKeyboard, useDebouncedCallback, useImpressionRef, useLongPress, useThrottledCallback } from 'react-simplikit';

export function Search() {
  const search = useDebouncedCallback({ onChange: setQuery, debounceMs: 300 });
  const save = useThrottledCallback({ onChange: setDraft, throttleMs: 1000 });
  const ref = useImpressionRef({ onImpressionStart: log, timeThresholdMs: 500 });
  const handlers = useLongPress(open, { delayMs: 400, onClick: select });
  const { style } = useAvoidKeyboard({ transitionDurationMs: 200 });

  return (
    <ImpressionArea timeThresholdMs={500} onImpressionStart={log}>
      <input ref={ref} style={style} onChange={search} onBlur={save} {...handlers} />
      <ImpressionArea as="li" timeThresholdMs={0} />
    </ImpressionArea>
  );
}
