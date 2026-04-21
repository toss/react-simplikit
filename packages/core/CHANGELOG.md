# react-simplikit

## 0.0.49

### Patch Changes

- [#339](https://github.com/toss/react-simplikit/pull/339) [`e5f6cac`](https://github.com/toss/react-simplikit/commit/e5f6cacd0bc93c03f361d0c825424937bc141809) Thanks [@sukvvon](https://github.com/sukvvon)! - feat(core/hooks): add 'useSet' hook

- [#219](https://github.com/toss/react-simplikit/pull/219) [`2a901bb`](https://github.com/toss/react-simplikit/commit/2a901bb903f4663571c7649769d3e29c9e844332) Thanks [@sukvvon](https://github.com/sukvvon)! - feat(core/hooks): add 'useIsClient' hook

- [#273](https://github.com/toss/react-simplikit/pull/273) [`ffc61bb`](https://github.com/toss/react-simplikit/commit/ffc61bb998fdaf129fff12e5e7515007ca5eeb51) Thanks [@wo-o29](https://github.com/wo-o29)! - docs: Add generic type support to useRefEffect interface

- [#278](https://github.com/toss/react-simplikit/pull/278) [`278b117`](https://github.com/toss/react-simplikit/commit/278b117152f8f01c54a66fc91c7c4c03fc74f7d9) Thanks [@wo-o29](https://github.com/wo-o29)! - fix: Replace array index keys with child keys in Separated

- [#347](https://github.com/toss/react-simplikit/pull/347) [`9a358e2`](https://github.com/toss/react-simplikit/commit/9a358e28e5407ab93c41dec486d932bbc9c42a64) Thanks [@eunwoo-levi](https://github.com/eunwoo-levi)! - use named functions in useEffect callbacks for better stack traces

- [#345](https://github.com/toss/react-simplikit/pull/345) [`35d13f8`](https://github.com/toss/react-simplikit/commit/35d13f8fb0aa12dd2c1e5aa15ae18f823ec323fd) Thanks [@eunwoo-levi](https://github.com/eunwoo-levi)! - fix useInterval to use globalThis instead of window for platform independence

- [`68e7ac8`](https://github.com/toss/react-simplikit/commit/68e7ac86650026709f2be7498c830dfe5cfdc2e1) Thanks [@sukvvon](https://github.com/sukvvon)! - feat(core/hooks): add 'useList' hook

- [`4b0c59e`](https://github.com/toss/react-simplikit/commit/4b0c59edb599406535a479c1f099a272c399ee99) Thanks [@sukvvon](https://github.com/sukvvon)! - feat(core/hooks): add 'useThrottledCallback' hook

- [#333](https://github.com/toss/react-simplikit/pull/333) [`4254542`](https://github.com/toss/react-simplikit/commit/4254542e481374c7f0e4de6dbacdfd10f076e529) Thanks [@dlsxjzld](https://github.com/dlsxjzld)! - remove window prefix from setTimeout and clearTimeout for platform-independent

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
