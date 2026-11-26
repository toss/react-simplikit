---
'react-simplikit': major
---

`useDebouncedCallback` and `useThrottledCallback` now wrap a function with any arguments and return it with a `cancel` method, like `useDebounce` and `useThrottle`. The option that takes the function is renamed from `onChange` to `callback`.

```ts
// before
const setQueryDebounced = useDebouncedCallback({
  onChange: setQuery,
  debounceMs: 300,
});

// after
const setQueryDebounced = useDebouncedCallback({
  callback: setQuery,
  debounceMs: 300,
});
setQueryDebounced.cancel();

// replaces useDebounce(search, 300) and useThrottle(track, 100)
const debouncedSearch = useDebouncedCallback({
  callback: search,
  debounceMs: 300,
});
const throttledTrack = useThrottledCallback({
  callback: track,
  throttleMs: 100,
});
```

The hooks no longer skip a call that repeats the value they forwarded last. Every call that settles, or that the throttle does not drop, now runs `callback`. A state setter such as `setQuery` ends in the same state, because setting the same value again does not change it. A callback with side effects, such as sending an analytics event or a request, now runs again for a repeated value; compare the value inside the callback if you relied on the skip.

The type parameter is now the type of the function instead of the type of the value. A call such as `useDebouncedCallback<string>({ ... })` no longer compiles; remove the type argument and annotate the parameter of `callback` instead.

`useImpressionRef` and `ImpressionArea` now skip a repeated start themselves, so `onImpressionStart` still does not fire twice when an element leaves and returns before the end is reported. Their behavior is otherwise unchanged, with one exception: when a component's effects are cleaned up and run again while its state is kept, as inside `<Activity mode="hidden">`, the end reported during cleanup is now followed by a new `onImpressionStart` once the element is seen again. Previously that start was dropped.
