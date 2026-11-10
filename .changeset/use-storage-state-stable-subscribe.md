---
'react-simplikit': patch
---

`useStorageState` now subscribes to storage changes once per key instead of on every render. The subscribe function handed to `useSyncExternalStore` was recreated each render, so React tore down and re-registered the internal listener and the `window` `storage` listener on every commit.
