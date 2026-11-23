---
'react-simplikit': patch
---

`useOutsideClickEffect` no longer calls the callback for the click that rendered its container. React runs the effects of a click's update before that click reaches `document`, so a popup opened by a button outside it closed again on the same click. Clicks are now ignored until the current task ends whenever a new container element appears.
