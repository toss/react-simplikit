# react-simplikit

## 0.0.48

### Patch Changes

- [#318](https://github.com/toss/react-simplikit/pull/318) [`466e3ce`](https://github.com/toss/react-simplikit/commit/466e3ceab51a499abb141bc1fe138d9109cc0df5) Thanks [@kimyouknow](https://github.com/kimyouknow)! - Fix broken package exports by moving main/types/module/exports from publishConfig to top-level package.json fields

  npm does not support publishConfig field overrides for manifest fields like main, types, and exports. The previous versions (react-simplikit@0.0.47, @react-simplikit/mobile@0.0.1) were published with incorrect entry points because publishConfig overrides were not applied during `npm publish`.

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
