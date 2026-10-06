---
'react-simplikit': patch
---

The JSDoc of `useIsomorphicLayoutEffect` now states that the effect never runs on the server and that the hook only avoids the `useLayoutEffect` warning, and no longer claims it supports both client and server environments.
