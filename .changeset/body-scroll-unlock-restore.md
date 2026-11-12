---
'react-simplikit': patch
---

`disableBodyScrollLock` (and so `useBodyScrollLock` on unmount) now returns the page to the state it was in before the lock. It puts back the inline `overflow`, `position`, `top`, `left`, `right` and `bottom` styles the `body` had, including `!important`, instead of removing them. It also jumps back to the saved scroll position with `behavior: 'instant'`; before, a page with `scroll-behavior: smooth` animated from the top back to that position.
