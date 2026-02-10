# react-simplikit

## 0.0.47

### Patch Changes

- [#316](https://github.com/toss/react-simplikit/pull/316) [`5b2eeba`](https://github.com/toss/react-simplikit/commit/5b2eeba659206cf9577dd57796a4770d07a33f62) Thanks [@kimyouknow](https://github.com/kimyouknow)! - Deprecate hooks that depend on browser-specific APIs

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

## 0.0.46

### Patch Changes

- [#292](https://github.com/toss/react-simplikit/pull/292) [`afaafd3`](https://github.com/toss/react-simplikit/commit/afaafd397a8c23caf26d8eb3167a31a06a864b2f) Thanks [@kimyouknow](https://github.com/kimyouknow)! - verify changeset automation workflow
