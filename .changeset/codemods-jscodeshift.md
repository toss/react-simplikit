---
'@react-simplikit/codemods': patch
---

`react-simplikit-codemod` is now `@react-simplikit/codemods` and runs its transforms through jscodeshift: `npx @react-simplikit/codemods mobile-to-root <path>`. The CLI asks for the transform and the path when they are left out, and takes `--dry`, `--print`, `--force` and `--jscodeshift`. Outside a dry run it stops on uncommitted git changes unless `--force` is passed. `--json`, `--ignore`, `--no-package-json` and `--debug` are gone; manual follow-ups are printed as jscodeshift `REP` lines, and a file that cannot be processed exits `1` as before. `--help` lists the transforms, every run except a dry run prints the next steps, and the package requires Node.js 22 or later. The package version now moves with `react-simplikit`.
