# @react-simplikit/mobile

## 0.1.1

### Patch Changes

- [#401](https://github.com/toss/react-simplikit/pull/401) [`9b93d29`](https://github.com/toss/react-simplikit/commit/9b93d299e9b105d060f2700b27ffb63001b88de3) Thanks [@hyesungoh](https://github.com/hyesungoh)! - Switched the build output from a single bundled file per package to per-module files, so bundlers can tree-shake unused exports at file granularity instead of relying on dead-code elimination inside one large bundle.

  The public API and runtime behavior are unchanged. For an app importing a single hook, this cuts the amount of code a bundler has to include: `react-simplikit`'s `useToggle` drops from 5363 B to 102 B minified, and `@react-simplikit/mobile`'s `useNetworkStatus` drops from 981 B to 570 B minified.

  The only user-visible change is packaging: output files are now `.mjs`/`.cjs` with `.d.mts`/`.d.cts` type declarations instead of a flat bundle, and for `react-simplikit` the `esm/` directory has been removed (`@react-simplikit/mobile` never had one — it always emitted to `dist/`). This does not affect the published `exports` map, so `import`/`require` usage is unaffected — only projects that deep-imported internal build paths (which were never part of the public `exports`) would be impacted.

## 0.1.0

### Minor Changes

- [#393](https://github.com/toss/react-simplikit/pull/393) [`a01348f`](https://github.com/toss/react-simplikit/commit/a01348f3921485d936bfc4bb4ab55a55b752fa0e) Thanks [@hyesungoh](https://github.com/hyesungoh)! - Export `useKeyboardHeight` from the package entry. The hook was documented but not importable: its folder was named `keyboardHeight`, breaking the folder-name convention, and the re-export was missing from `src/index.ts`. The folder is renamed to `useKeyboardHeight` and the hook is now part of the public API.

## 0.0.2

### Patch Changes

- [#318](https://github.com/toss/react-simplikit/pull/318) [`466e3ce`](https://github.com/toss/react-simplikit/commit/466e3ceab51a499abb141bc1fe138d9109cc0df5) Thanks [@kimyouknow](https://github.com/kimyouknow)! - Fix broken package exports by moving main/types/module/exports from publishConfig to top-level package.json fields

  npm does not support publishConfig field overrides for manifest fields like main, types, and exports. The previous versions (react-simplikit@0.0.47, @react-simplikit/mobile@0.0.1) were published with incorrect entry points because publishConfig overrides were not applied during `npm publish`.

## 0.0.1

### Patch Changes

- [#313](https://github.com/toss/react-simplikit/pull/313) [`347ed21`](https://github.com/toss/react-simplikit/commit/347ed216155d6a22239ce6d9b778d8e3242f80c1) Thanks [@kimyouknow](https://github.com/kimyouknow)! - Add `@react-simplikit/mobile` package with monorepo structure. Mobile web utilities (viewport, keyboard, body scroll lock, safe area, etc.). [#308](https://github.com/toss/react-simplikit/pull/308)
