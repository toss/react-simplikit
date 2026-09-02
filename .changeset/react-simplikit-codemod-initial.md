---
'react-simplikit-codemod': minor
---

Add the `react-simplikit-codemod` CLI with the `mobile-to-root` transform. It rewrites `@react-simplikit/mobile` imports to the `react-simplikit` root entry, folds them into an existing `react-simplikit` import when merging cannot change what a name binds, and swaps the dependency in every `package.json` it finds.
