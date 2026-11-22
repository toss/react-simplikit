---
name: react-simplikit-codemod
description: Migrates a codebase off the deprecated @react-simplikit/mobile package onto the react-simplikit root entry. Use when a project still imports @react-simplikit/mobile, when an install warns that the package is deprecated, or when someone asks how to migrate off it.
license: MIT
metadata:
  author: toss
---

# react-simplikit-codemod

## When to use this

The project imports `@react-simplikit/mobile`, which is deprecated. Every export of that package now ships from the `react-simplikit` root entry.

Do **not** run this when the project has no `@react-simplikit/mobile` dependency, or when the user only asked a question about the migration — answer from this file instead.

## Preconditions

- Node.js 20 or later.
- The working tree is committed or stashed. This command rewrites files in place and has no undo of its own, so outside `--dry` it refuses to run on uncommitted changes and exits `1`. Pass `--force` only when the user has said to run on a dirty tree.

## Commands

Always pass both the transform and the path. Without a terminal to ask in, the CLI exits `1` when either is missing.

Preview first — this writes nothing:

```bash
npx @react-simplikit/codemods mobile-to-root . --dry
```

Apply:

```bash
npx @react-simplikit/codemods mobile-to-root .
```

Limit it to one directory:

```bash
npx @react-simplikit/codemods mobile-to-root src
```

`--print` also writes each transformed file to stdout. To skip extra paths, hand jscodeshift its own option: `--jscodeshift="--ignore-pattern=**/legacy/**"`. There is no flag to leave `package.json` alone; narrow the path argument instead. `node_modules`, `dist`, `build`, `out`, `coverage`, `.next`, `.yarn`, `.git` and `.pnp.*` are always skipped. The command is safe to run twice.

## Reading the output

The run is jscodeshift's, so its lines follow jscodeshift's format:

- ` ERR <file> Transformation error (...)` — the file could not be parsed or transformed. It was left untouched
- ` REP <file> <message>` — a manual follow-up. In a source file the message starts with `line <n>:` and names either an import the codemod deliberately left on its own or a mention of the package it could not rewrite, such as a `moduleNameMapper` entry. In a `package.json` it names a field to check by hand: an `overrides` or `resolutions` entry it did not edit, or a dependency whose `workspace:`/`catalog:`/`file:` spec it could not check
- `Results:` with counts of `errors`, `unmodified`, `skipped` and `ok` — `ok` is the number of files rewritten
- `Next steps:` — printed after a run that wrote files. It repeats the steps under **After the run** below

## After the run

1. Act on every `REP` line by hand. Read the reason first: merging an import the codemod left on its own can strand the comment that sits on it.
2. Run a bare `npm install` (or the equivalent) so the lockfile drops the old package. Do not run `npm install react-simplikit` — it would overwrite the range the codemod just wrote.
3. Run the project's formatter or linter fix (`eslint --fix`, say) on the changed files. Import-order rules place `react-simplikit` differently from `@react-simplikit/mobile`, so a sorted import block is usually out of order after the run.
4. Require `react-simplikit@0.2.0` or newer — the first release re-exporting the `SafeAreaInset` type from the root entry. An existing range below that floor is raised automatically; a `workspace:`/`catalog:`/`file:` protocol is kept and reported instead.

## Failure handling

| Exit code | What to do                                                                                                                                                                                                                                |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `1`       | The transform name or the path was wrong, or the working tree has uncommitted changes — stderr says which. Otherwise some files could not be processed — they are the `ERR` lines, and every other file was migrated. Fix those and rerun |
| `0`       | Done. Review the diff                                                                                                                                                                                                                     |

A file that imports the same name twice — once from each package, say — fails to parse. Remove the duplicate import and rerun.
