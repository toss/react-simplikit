---
'react-simplikit': patch
---

Cancel pending useLongPress timers when the component unmounts, preventing
onLongPress from firing after unmount.
