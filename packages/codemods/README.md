# @react-simplikit/codemods

[![npm version](https://img.shields.io/npm/v/@react-simplikit/codemods.svg)](https://www.npmjs.com/package/@react-simplikit/codemods)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/react-simplikit/blob/main/LICENSE)

Codemods for `react-simplikit`, run with [jscodeshift](https://github.com/facebook/jscodeshift).

## Usage

Requires Node.js 20 or later. In your terminal, navigate into your project's folder, then run:

```shell
npx @react-simplikit/codemods <transform> <path>
```

Leave out `<transform>` or `<path>` and the CLI asks for it in a terminal; anywhere else, such as CI, it exits `1`. The command rewrites files in place, so **commit or stash your work first**, then review the diff. Outside a dry run it stops when the git working tree has uncommitted changes; `--force` runs anyway.

| Option                        | Meaning                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------ |
| `-d, --dry`                   | Dry run: report what would change without writing anything                                             |
| `-p, --print`                 | Print the transformed files to stdout                                                                  |
| `-f, --force`                 | Run even when the git working tree has uncommitted changes                                             |
| `-j, --jscodeshift <options>` | Pass options straight to jscodeshift, such as `--jscodeshift="--cpus=2 --ignore-pattern=**/legacy/**"` |
| `-v, --version`               | Print the version                                                                                      |
| `-h, --help`                  | Print the help                                                                                         |

`node_modules`, `dist`, `build`, `out`, `coverage`, `.next`, `.yarn`, `.git` and `.pnp.*` are always skipped.

`--help` lists every transform. jscodeshift prints one line per file it could not transform (`ERR`) and one per manual follow-up (`REP`), then a summary, and a run that wrote files ends with the transform's next steps. The command exits `1` when any file failed, on an unknown transform or a path that does not exist, on uncommitted changes without `--force`, or when a prompt is cancelled. Every other file is still migrated, and running it twice is safe.

## `mobile-to-root`

`@react-simplikit/mobile` was absorbed into the `react-simplikit` root entry. This transform rewrites every import of the old package to the root entry, and folds the bindings into an existing `react-simplikit` import when the file already has one.

```shell
npx @react-simplikit/codemods mobile-to-root .
```

### What it changes

- `import`, `import type`, `import * as ns`, and side-effect imports
- `export ... from` and `export * from`
- `require('@react-simplikit/mobile')`, `require.resolve`, `import m = require(...)`, and `await import('@react-simplikit/mobile')`
- `import('@react-simplikit/mobile').SafeAreaInset` in type position
- `vi.mock` / `vi.importActual` / `jest.mock` / `jest.requireActual` module arguments
- `dependencies`, `devDependencies`, `peerDependencies` and `optionalDependencies` in every `package.json` it finds

Source files are parsed with Babel — TypeScript and JSX, with Flow as a fallback for `.js` files — and edited by offset, so formatting, comments and quote style survive untouched. `package.json` is the exception: it is reparsed and reserialized, which normalizes line endings and collapses any hand formatting.

### What it leaves alone

- Markdown, MDX, comments, and any other prose naming the package
- A source file that names the package where no import could be rewritten — a `moduleNameMapper` entry, say. It is reported so you can check it by hand
- `resolutions` and `overrides` in `package.json` — reported, not edited, because their meaning differs per package manager
- Imports it will not fold into an existing `react-simplikit` import — the specifier is rewritten in place instead:
  - a comment sits on the import's own line, where merging would strand it — **reported**
  - the import sits inside a `declare module` block, or binds a default or namespace — not reported, because merging it by hand fails to compile rather than passing quietly
- A file that imports one name twice, from either package. Babel refuses to parse it, so it is reported as an error. Remove the duplicate and run again
- Your lockfile. Reinstall after the run

### After running

```shell
npm install
```

The codemod already wrote the dependency and its version range, so a bare reinstall is enough — `npm install react-simplikit` would overwrite that range with whatever is newest.

Then run your formatter or linter fix on the changed files. The specifier moved from `@react-simplikit/mobile` to `react-simplikit`, and import-order rules such as `import/order` or `simple-import-sort` place the two differently, so an import that was sorted before the run is usually out of order after it.

One import needs a version floor: `SafeAreaInset` is only re-exported from the root entry in `react-simplikit@0.2.0` and later. An existing range is kept only when every version it admits sits on or above that floor; `^0.1.0`, `>=0.1.0` and `*` are raised to `^0.2.0`, because a lockfile could keep an older version under them. A `workspace:`, `catalog:` or `file:` protocol is kept as-is and reported instead, since only you know what it should point at.
