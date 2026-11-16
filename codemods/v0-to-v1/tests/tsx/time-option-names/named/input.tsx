import { ImpressionArea, useAvoidKeyboard, useDebouncedCallback, useImpressionRef, useLongPress, useThrottledCallback } from 'react-simplikit';

export function Search() {
  const search = useDebouncedCallback({ onChange: setQuery, timeThreshold: 300 });
  const save = useThrottledCallback({ onChange: setDraft, timeThreshold: 1000 });
  const ref = useImpressionRef({ onImpressionStart: log, timeThreshold: 500 });
  const handlers = useLongPress(open, { delay: 400, onClick: select });
  const { style } = useAvoidKeyboard({ transitionDuration: 200 });

  return (
    <ImpressionArea timeThreshold={500} onImpressionStart={log}>
      <input ref={ref} style={style} onChange={search} onBlur={save} {...handlers} />
      <ImpressionArea as="li" timeThreshold={0} />
    </ImpressionArea>
  );
}
