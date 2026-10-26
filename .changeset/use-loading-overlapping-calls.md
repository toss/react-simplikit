---
'react-simplikit': patch
---

`useLoading` now keeps `loading` as `true` until every promise passed to `startLoading` has settled. Before, when two calls overlapped, the first promise to settle set `loading` to `false` while the other was still pending.
