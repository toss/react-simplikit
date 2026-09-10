---
'react-simplikit': patch
---

`mergeRefs` now forwards the cleanup functions that callback refs can return since React 19. When at least one of the merged refs returns a cleanup, the merged ref returns one as well, so React runs those cleanups on detach instead of calling the callbacks with `null`; refs that returned nothing are still reset to `null` inside that cleanup. When no ref returns a cleanup the merged ref returns nothing, as before, so React 18 keeps its existing `null` call and does not warn.
