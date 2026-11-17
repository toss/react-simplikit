---
'react-simplikit': patch
---

`disableBodyScrollLock` (and so `useBodyScrollLock` on unmount) now returns the page to the state it was in before the lock. It puts back the inline `overflow`, `position`, `top`, `left`, `right` and `bottom` styles the `body` had, including `!important`, instead of removing them; a property that other code changed while the body was locked is left as it is. It also jumps back to the saved scroll position with `behavior: 'instant'`; before, when the root element (`html`) had `scroll-behavior: smooth`, the page jumped to the top and animated back to that position.
