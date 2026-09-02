# react-simplikit-codemod

## 0.1.0

### Minor Changes

- [#458](https://github.com/toss/react-simplikit/pull/458) [`c27417b`](https://github.com/toss/react-simplikit/commit/c27417bbdce140a6bb0de33a57866f537f31fb2c) Thanks [@mnxmnz](https://github.com/mnxmnz)! - Add the `react-simplikit-codemod` CLI with the `mobile-to-root` transform. It rewrites `@react-simplikit/mobile` imports to the `react-simplikit` root entry, folds them into an existing `react-simplikit` import when merging cannot change what a name binds, and swaps the dependency in every `package.json` it finds.
