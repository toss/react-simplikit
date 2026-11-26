---
'react-simplikit': patch
---

Rename the comparison parameter of `usePrevious` and `usePreservedReference` to `equalityFn`, matching `useControlledState`. `usePrevious` now compares with `Object.is` by default, so rendering `NaN` again no longer overwrites the previous value, and a change between `0` and `-0` is detected.
