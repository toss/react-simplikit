---
'react-simplikit': major
---

Time-related options and parameters now include `Ms` in their names.
These option keys are renamed, so existing calls need to be updated:

- `useDebouncedCallback`: `timeThreshold` → `debounceMs`
- `useThrottledCallback`: `timeThreshold` → `throttleMs`
- `useImpressionRef`, `ImpressionArea`: `timeThreshold` → `timeThresholdMs`
- `useLongPress`: `delay` → `delayMs`
- `useAvoidKeyboard`: `transitionDuration` → `transitionDurationMs`

```ts
// before
useDebouncedCallback({ onChange: setQuery, timeThreshold: 300 });
// after
useDebouncedCallback({ onChange: setQuery, debounceMs: 300 });
```

The positional `wait` parameter of `useDebounce`, `useDebouncedValue`, `useThrottle` and `useThrottledValue` is now `debounceMs` / `throttleMs`. Calls like `useDebounce(fn, 300)` keep working.
