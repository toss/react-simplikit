# @react-simplikit/mobile

## 0.0.2

### Patch Changes

- [#318](https://github.com/toss/react-simplikit/pull/318) [`466e3ce`](https://github.com/toss/react-simplikit/commit/466e3ceab51a499abb141bc1fe138d9109cc0df5) Thanks [@kimyouknow](https://github.com/kimyouknow)! - Fix broken package exports by moving main/types/module/exports from publishConfig to top-level package.json fields

  npm does not support publishConfig field overrides for manifest fields like main, types, and exports. The previous versions (react-simplikit@0.0.47, @react-simplikit/mobile@0.0.1) were published with incorrect entry points because publishConfig overrides were not applied during `npm publish`.

## 0.0.1

### Patch Changes

- [#313](https://github.com/toss/react-simplikit/pull/313) [`347ed21`](https://github.com/toss/react-simplikit/commit/347ed216155d6a22239ce6d9b778d8e3242f80c1) Thanks [@kimyouknow](https://github.com/kimyouknow)! - Add `@react-simplikit/mobile` package with monorepo structure. Mobile web utilities (viewport, keyboard, body scroll lock, safe area, etc.). [#308](https://github.com/toss/react-simplikit/pull/308)
