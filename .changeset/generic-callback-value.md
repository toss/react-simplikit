---
'react-simplikit': minor
---

`useDebouncedCallback` and `useThrottledCallback` now accept any value type: `onChange` is typed `(newValue: T) => void` instead of `(newValue: boolean) => void`, so a debounced search query or a throttled scroll position no longer needs a cast. Existing boolean callers are unaffected.

`useDebouncedCallback` no longer drops a first call of `false`. It compared incoming values against a seed of `false`, so the very first `false` looked redundant and was never forwarded; the comparison now starts from a sentinel, as `useThrottledCallback` already did. A `false` that arrives while an initial `true` is still pending now replaces it instead of being ignored.

`useImpressionRef` no longer emits `onImpressionEnd` for an element that was never impressed.
