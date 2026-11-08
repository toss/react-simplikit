---
'react-simplikit': patch
---

`useStorageState` now returns the current `defaultValue` when the key is not stored and `defaultValue` or `key` changes between renders. The snapshot cache only compared the raw stored string, so two absent keys both read as `null` and the default parsed on the first render was returned forever.
