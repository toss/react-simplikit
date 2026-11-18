---
'react-simplikit': patch
---

`useScrollDirection` re-checks `window.scrollY` when the throttle timer ends. Before, a scroll that stopped inside the throttle window left `position` stale.
