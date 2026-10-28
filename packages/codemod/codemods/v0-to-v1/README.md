# react-simplikit v0 to v1

Rewrites react-simplikit call sites for the breaking changes in [v1.0.0](https://github.com/toss/react-simplikit/issues/533).

> [!NOTE]
> Work in progress. Only the transforms listed below are implemented; the rest of the roadmap lands one transform at a time.

## Usage

Commit or stash first, then run from your project root:

```bash
npx codemod@1.18.6 workflow run -w <path to this folder>/workflow.yaml
```

## What it changes

| Breaking change                                                    | Before                                          | After                                                 |
| ------------------------------------------------------------------ | ----------------------------------------------- | ----------------------------------------------------- |
| [#535](https://github.com/toss/react-simplikit/issues/535) options | `useDoubleClick({ click, doubleClick, delay })` | `useDoubleClick({ onClick, onDoubleClick, delayMs })` |

Only calls that resolve to an import from `react-simplikit` are rewritten, including aliased (`import { useDoubleClick as useDbl }`) and namespace (`simplikit.useDoubleClick`) imports.

## What it reports instead of changing

Code it cannot rewrite safely is left as is and listed under `manual-review` in the metrics printed after the run:

| `reason`             | Example                                                      |
| -------------------- | ------------------------------------------------------------ |
| `options-not-inline` | `useDoubleClick(options)`                                    |
| `options-spread`     | `useDoubleClick({ ...base, doubleClick })` (the spread part) |
