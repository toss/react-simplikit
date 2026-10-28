---
'react-simplikit': patch
---

`useLongPress` no longer calls `onClick` twice for a tap on touch devices. After `touchend`, browsers fire emulated `mousedown`/`mouseup` events on the same element, and the hook handled them as a second, mouse press. That also called `onClick` after `onLongPressEnd` when the long press came from touch. Mouse presses that start within 1 second of a touch event are now ignored.
