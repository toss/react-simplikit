---
'react-simplikit': patch
---

`useDebouncedCallback` no longer forwards a stale value when the caller returns to the last forwarded one. Calling it with `'seo'` and then `'seoul'` right after `'seoul'` had already been forwarded used to skip the second call as a duplicate without cancelling the pending `'seo'`, so `onChange('seo')` fired anyway. The pending call is now cancelled first.
