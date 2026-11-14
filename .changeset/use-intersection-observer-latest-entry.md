---
'react-simplikit': patch
---

`useIntersectionObserver` now passes the latest entry of a batch to the callback. Before, it read only the first entry, so when an element entered and left the viewport within one observer tick the callback received the stale "entered" entry and missed the exit.
