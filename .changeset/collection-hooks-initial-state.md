---
'react-simplikit': patch
---

`useList`, `useSet` and `useMap` no longer serialize `initialState` with `JSON.stringify` on every render. Before, they threw on the first render when the initial values held a `BigInt` or a circular object. `reset` now always uses the latest `initialState`; for `useSet` and `useMap` it used to keep the first `Set` or `Map` it was given.
