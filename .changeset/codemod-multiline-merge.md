---
'react-simplikit-codemod': patch
---

`mobile-to-root` keeps one binding per line when it folds imports into a `react-simplikit` import that is already written that way, instead of appending them all to the last line. The closing message and the README now say to run your formatter or linter fix on the changed files: import-order rules place `react-simplikit` differently from `@react-simplikit/mobile`, so a sorted import block is usually out of order after the run.
