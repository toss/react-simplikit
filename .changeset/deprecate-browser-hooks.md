---
'react-simplikit': patch
---

Deprecate hooks that depend on browser-specific APIs

The following hooks are now marked as deprecated:

- `useDoubleClick`
- `useGeolocation`
- `useImpressionRef`
- `useIntersectionObserver`
- `useLongPress`
- `useOutsideClickEffect`
- `useStorageState`
- `useVisibilityEvent`

These hooks will be removed in a future major version as react-simplikit is now focused on platform-independent, pure state/logic hooks.
