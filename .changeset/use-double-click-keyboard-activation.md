---
'react-simplikit': patch
---

`useDoubleClick` now runs `click` immediately for clicks that carry no click count (`event.detail === 0`), such as Enter/Space on a native button or a programmatic `element.click()`. The handler only recognised `detail` 1 and 2, so these clicks were dropped, and they also cancelled a pending mouse click. `doubleClick` is still only called for `detail === 2`.
