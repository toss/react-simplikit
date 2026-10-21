---
'react-simplikit': minor
---

The emitted declarations of `usePreservedCallback`, `useDebounce`, `useThrottle` and `useCallbackOncePerRender` now name their callback parameter type `CallerTypedArgs` instead of `any[]`. It is the same type, so they accept the same callbacks. `useThrottle` also constrains the callback's return type to `unknown` instead of `any`, which accepts the same callbacks.

The throttled function returned by `useThrottle` now accepts the callback's parameters instead of `any[]`, so calling it with arguments the callback does not take is a type error. The return types of `useThrottle` and `useDebounce` are now written out in their declarations, so a consumer that emits declarations can export their result without a TS2742 error.
