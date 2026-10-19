---
'react-simplikit': patch
---

The emitted declarations of `usePreservedCallback`, `useDebounce`, `useThrottle` and `useCallbackOncePerRender` now name their callback parameter type `CallerTypedArgs` instead of `any[]`. It is the same type, so no call site changes. `useThrottle` also constrains the callback's return type to `unknown` instead of `any`, which accepts the same callbacks.
