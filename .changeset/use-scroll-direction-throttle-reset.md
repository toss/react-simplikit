---
'react-simplikit': patch
---

`useScrollDirection` no longer stops tracking scroll when `throttleMs` changes, or the component's effects re-run, while a throttle window is still open. The cleanup cleared the pending timer but left its id in the ref, so the next listener treated every scroll as throttled.
