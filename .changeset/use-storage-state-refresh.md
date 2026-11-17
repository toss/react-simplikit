---
'react-simplikit': patch
---

`useStorageState`'s `refreshState` no longer writes to storage. Before, it wrote the current snapshot back, so calling it on an empty key persisted `defaultValue`.
