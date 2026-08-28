---
'react-simplikit': patch
---

`useDebouncedCallback` and `useThrottledCallback` no longer forward a stale value when the caller returns to the last forwarded one. Calling with `'seo'` and then `'seoul'` right after `'seoul'` had already been forwarded used to skip the second call as a duplicate without cancelling the pending `'seo'`, so `onChange('seo')` fired anyway. The pending call is now cancelled first. For `useThrottledCallback` this only showed with `edges: ['trailing']`; the default leading edge forwards the intermediate value immediately and masked it.
