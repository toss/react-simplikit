# react-simplikit-codemod

## 0.1.1

### Patch Changes

- [#459](https://github.com/toss/react-simplikit/pull/459) [`61feb24`](https://github.com/toss/react-simplikit/commit/61feb246a452d208bc51ddf0a7e514d25e9a7215) Thanks [@mnxmnz](https://github.com/mnxmnz)! - `mobile-to-root` keeps one binding per line when it folds imports into a `react-simplikit` import that is already written that way, instead of appending them all to the last line. The closing message and the README now say to run your formatter or linter fix on the changed files: import-order rules place `react-simplikit` differently from `@react-simplikit/mobile`, so a sorted import block is usually out of order after the run.

## 0.1.0

### Minor Changes

- [#458](https://github.com/toss/react-simplikit/pull/458) [`c27417b`](https://github.com/toss/react-simplikit/commit/c27417bbdce140a6bb0de33a57866f537f31fb2c) Thanks [@mnxmnz](https://github.com/mnxmnz)! - Add the `react-simplikit-codemod` CLI with the `mobile-to-root` transform. It rewrites `@react-simplikit/mobile` imports to the `react-simplikit` root entry, folds them into an existing `react-simplikit` import when merging cannot change what a name binds, and swaps the dependency in every `package.json` it finds.
