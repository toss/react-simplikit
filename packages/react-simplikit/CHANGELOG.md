# react-simplikit

## 0.1.0

### Minor Changes

- [#437](https://github.com/toss/react-simplikit/pull/437) [`fe2226d`](https://github.com/toss/react-simplikit/commit/fe2226d5fbfcd305ab888cef83450f7f0e1caa77) Thanks [@mnxmnz](https://github.com/mnxmnz)! - Absorb `@react-simplikit/mobile` into the root export of `react-simplikit`. Update imports from `@react-simplikit/mobile` to `react-simplikit`; the exported APIs are unchanged. The `@react-simplikit/mobile` npm package will be deprecated with a pointer to `react-simplikit` after this release.

### Patch Changes

- [#423](https://github.com/toss/react-simplikit/pull/423) [`36e3e4c`](https://github.com/toss/react-simplikit/commit/36e3e4ccbd9c7a45bda18f33dcb514c97f387cbb) Thanks [@Antoliny0919](https://github.com/Antoliny0919)! - The returned handler was typed as `ChangeEventHandler<HTMLInputElement>`, so passing it to a `<textarea>` raised a type error even though the runtime behavior was identical. The handler is now typed as `ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>`, so it can be attached to both `<input>` and `<textarea>` elements.

- [#424](https://github.com/toss/react-simplikit/pull/424) [`1ac0166`](https://github.com/toss/react-simplikit/commit/1ac0166d8f41c1159d004bd9c8192f2e59f6efc8) Thanks [@hyesungoh](https://github.com/hyesungoh)! - fix(core): opt the remaining React Compiler-incompatible hooks out with `'use no memo'`

## 0.0.53

### Patch Changes

- [#379](https://github.com/toss/react-simplikit/pull/379) [`e2030a2`](https://github.com/toss/react-simplikit/commit/e2030a2deac81fb247b9f601fab19d87a067cc9c) Thanks [@lumirlumir](https://github.com/lumirlumir)! - fix(usePrevious): opt out `usePrevious` hook from React Compiler

- [#404](https://github.com/toss/react-simplikit/pull/404) [`cac80cb`](https://github.com/toss/react-simplikit/commit/cac80cb41897b834bb3661336faa84197c558c1e) Thanks [@bbjbc](https://github.com/bbjbc)! - fix(useThrottledCallback): invoke the callback when the first value is `false`

  The hook skips redundant invocations by comparing the incoming value against the last one it forwarded, but that comparison was seeded with `false`. Because the hook takes no initial value from the caller, a first call of `false` looked redundant and was dropped — so consumers whose state starts as `true` lost the transition back to `false`. The comparison now starts from a sentinel, so the first call is always forwarded regardless of its value.

## 0.0.52

### Patch Changes

- [#401](https://github.com/toss/react-simplikit/pull/401) [`9b93d29`](https://github.com/toss/react-simplikit/commit/9b93d299e9b105d060f2700b27ffb63001b88de3) Thanks [@hyesungoh](https://github.com/hyesungoh)! - Switched the build output from a single bundled file per package to per-module files, so bundlers can tree-shake unused exports at file granularity instead of relying on dead-code elimination inside one large bundle.

  The public API and runtime behavior are unchanged. For an app importing a single hook, this cuts the amount of code a bundler has to include: `react-simplikit`'s `useToggle` drops from 5363 B to 102 B minified, and `@react-simplikit/mobile`'s `useNetworkStatus` drops from 981 B to 570 B minified.

  The only user-visible change is packaging: output files are now `.mjs`/`.cjs` with `.d.mts`/`.d.cts` type declarations instead of a flat bundle, and for `react-simplikit` the `esm/` directory has been removed (`@react-simplikit/mobile` never had one — it always emitted to `dist/`). This does not affect the published `exports` map, so `import`/`require` usage is unaffected — only projects that deep-imported internal build paths (which were never part of the public `exports`) would be impacted.

## 0.0.51

### Patch Changes

- [#351](https://github.com/toss/react-simplikit/pull/351) [`da1f51c`](https://github.com/toss/react-simplikit/commit/da1f51cc9b860dde91dcfd120605eb6a93de3b55) Thanks [@eunwoo-levi](https://github.com/eunwoo-levi)! - fix(core/hooks): call cleanup when unmount occurs before async effect resolves

- [#352](https://github.com/toss/react-simplikit/pull/352) [`fa3daa5`](https://github.com/toss/react-simplikit/commit/fa3daa52d18644ac90a35fc8a79501eae7bb0269) Thanks [@eunwoo-levi](https://github.com/eunwoo-levi)! - fix(core/hooks): prevent immediate callback from re-firing when enabled is toggled

## 0.0.50

### Patch Changes

- [#362](https://github.com/toss/react-simplikit/pull/362) [`fc9b1dc`](https://github.com/toss/react-simplikit/commit/fc9b1dcc2be7902ffe487c5868180317b9f07730) Thanks [@guesung](https://github.com/guesung)! - refactor(core): narrow types in `debounce` utility to reduce `any` usage

- [#259](https://github.com/toss/react-simplikit/pull/259) [`1d9ec79`](https://github.com/toss/react-simplikit/commit/1d9ec7984899d1d8dcda16d15efa66f458c347fa) Thanks [@wo-o29](https://github.com/wo-o29)! - refactor(useCounter): extract validateValue as pure function and remove unnecessary useCallback

- [#272](https://github.com/toss/react-simplikit/pull/272) [`75ab148`](https://github.com/toss/react-simplikit/commit/75ab1484a1af68a2f27fa31da8f6094f0c63d37f) Thanks [@wo-o29](https://github.com/wo-o29)! - refactor(usePrevious): remove unnecessary `undefined` from compare argument and return type

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
