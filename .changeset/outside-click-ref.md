---
'react-simplikit': minor
---

Add `useOutsideClickRef`, which returns a callback ref and calls `onOutsideClick` when a click happens outside every element the ref is attached to. One ref can be shared by a trigger and its menu, so the elements no longer need their own state. Pass `enabled: false` to stop listening, for example while the menu is closed. A pointer press that starts inside and is released outside is not treated as an outside click.
