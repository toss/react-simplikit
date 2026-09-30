---
'react-simplikit': minor
---

Add `usePageVisibilityEffect`, which runs a callback when the page visibility changes and pairs by name with `usePageVisibility`, which returns the same value as state. `useVisibilityEvent` is deprecated in favor of `usePageVisibilityEffect` and still works as before, since it is now the same function under its old name.
