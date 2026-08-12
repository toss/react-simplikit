---
'react-simplikit': patch
'@react-simplikit/mobile': patch
---

Switched the build output from a single bundled file per package to per-module files, so bundlers can tree-shake unused exports at file granularity instead of relying on dead-code elimination inside one large bundle.

The public API and runtime behavior are unchanged. For an app importing a single hook, this cuts the amount of code a bundler has to include: `react-simplikit`'s `useToggle` drops from 5363 B to 102 B minified, and `@react-simplikit/mobile`'s `useNetworkStatus` drops from 981 B to 570 B minified.

The only user-visible change is packaging: output files are now `.mjs`/`.cjs` with `.d.mts`/`.d.cts` type declarations instead of a flat bundle, and for `react-simplikit` the `esm/` directory has been removed (`@react-simplikit/mobile` never had one — it always emitted to `dist/`). This does not affect the published `exports` map, so `import`/`require` usage is unaffected — only projects that deep-imported internal build paths (which were never part of the public `exports`) would be impacted.
