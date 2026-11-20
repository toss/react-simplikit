---
'react-simplikit': patch
---

`useOutsideClickEffect` no longer calls the callback for the click that mounted it. React runs the effects of a click's update before that click reaches `document`, so a popup that renders `useOutsideClickEffect` and opens from a button outside it closed again on the same click.
