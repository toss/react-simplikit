---
'react-simplikit': patch
---

`useVisibilityEvent` now keeps one `visibilitychange` listener for the life of the component. The listener was keyed on the `callback` reference, so an inline callback removed and re-added it on every render, and with `immediate: true` a callback that updated state re-ran on every render, which could loop forever. The callback is now preserved and always sees the latest closure.
