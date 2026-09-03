---
'react-simplikit': patch
---

`useIntersectionObserver` no longer recreates the underlying `IntersectionObserver` on every render when an inline `options` object is passed. It now recreates it only when `root`, `rootMargin`, or `threshold` actually change.
