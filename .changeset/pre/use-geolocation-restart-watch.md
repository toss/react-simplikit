---
'react-simplikit': major
---

`useGeolocation` now restarts a watch started with `startTracking()` when `enableHighAccuracy`, `maximumAge` or `timeout` changes, the same way `mountBehavior: 'watch'` already did. Before, the watch kept its original options until `stopTracking()` and `startTracking()` were called again. A stopped watch is not started again by an option change.
