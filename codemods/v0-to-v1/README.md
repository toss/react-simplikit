# react-simplikit v0 to v1

Rewrites react-simplikit call sites for the breaking changes in [v1.0.0](https://github.com/toss/react-simplikit/issues/533).

> [!NOTE]
> Work in progress. Only the transforms listed below are implemented; the rest of the roadmap lands one transform at a time. It is not on npm yet: until then, run `node codemods/cli.mjs v0-to-v1 -t <your project>` from a clone of this repository.

## Usage

Commit or stash first, then run from your project root:

```bash
npx @react-simplikit/codemod v0-to-v1
```

Options after `v0-to-v1` go to the Codemod CLI. Useful ones:

- `--dry-run` shows what would change without writing files.
- `-t <path>` runs on another folder instead of the current one.
- `--no-interactive` skips prompts, for CI and coding agents.
- `--disable-analytics` (or `DISABLE_ANALYTICS=1`) turns off the CLI's usage analytics.

## What it changes

| Breaking change                                                    | Before                                          | After                                                 |
| ------------------------------------------------------------------ | ----------------------------------------------- | ----------------------------------------------------- |
| [#535](https://github.com/toss/react-simplikit/issues/535) options | `useDoubleClick({ click, doubleClick, delay })` | `useDoubleClick({ onClick, onDoubleClick, delayMs })` |

Only calls that resolve to an import from `react-simplikit` are rewritten, including aliased (`import { useDoubleClick as useDbl }`) and namespace (`simplikit.useDoubleClick`) imports.

## What it reports instead of changing

Code it cannot rewrite safely is left as is and listed under `manual-review` in the metrics printed after the run, with its `file` and `line`:

| `reason`               | Example                                                      |
| ---------------------- | ------------------------------------------------------------ |
| `options-not-inline`   | `useDoubleClick(options)`                                    |
| `options-spread`       | `useDoubleClick({ ...base, doubleClick })` (the spread part) |
| `options-computed-key` | `useDoubleClick({ [key]: select })`                          |
| `require-not-followed` | `const { useDoubleClick } = require('react-simplikit')`      |
| `re-exported`          | `export { useDoubleClick } from 'react-simplikit'`           |

A spread is reported on every run, because the codemod cannot tell whether it still holds an old key.

## After running

1. Review the diff, and run your formatter if the edits do not match your style.
2. Fix each `manual-review` entry by hand. Copy the list before closing the terminal; it is not saved anywhere.
3. Upgrade `react-simplikit` to v1.
