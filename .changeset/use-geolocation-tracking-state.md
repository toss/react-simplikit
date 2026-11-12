---
'react-simplikit': patch
---

`useGeolocation` no longer leaves `loading` stuck at `true` when `stopTracking()` is called before the first position arrives. A watch started with `startTracking()` also keeps running when a position option such as `enableHighAccuracy` changes. Before, the watch was cleared without being restarted while `isTracking` stayed `true`.
