---
'react-simplikit-codemod': patch
---

`mobile-to-root` now asks semver whether an existing `react-simplikit` range already guarantees the `0.2.0` floor, instead of comparing digits it pulled out of the string. A wildcard such as `*` still admits an older version, so it is raised to `^0.2.0` rather than left in place; a `workspace:`, `file:` or dist-tag spec that semver cannot read is kept and reported. An `--ignore` glob is joined onto the current directory with `path.posix.join`, so `./legacy/**` and `legacy/**` read the same way.
