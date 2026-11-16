---
'react-simplikit': patch
---

`subscribeKeyboardHeight` now delivers the latest keyboard height once the throttle window ends. Before, events that fired while a window was open were dropped, so a keyboard animation that finished inside the window left the callback at an intermediate height.
