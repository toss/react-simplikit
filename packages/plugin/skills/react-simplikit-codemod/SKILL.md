---
name: react-simplikit-codemod
description: Runs react-simplikit's upgrade codemods. v0-to-v1 rewrites call sites for the v1.0.0 breaking changes (option names, timer hook arguments, state hook return shapes). mobile-to-root moves a codebase off the deprecated @react-simplikit/mobile package onto the react-simplikit root entry. Use when upgrading react-simplikit from 0.x to 1.x, when type errors appear in react-simplikit calls after that upgrade, when a project still imports @react-simplikit/mobile, or when someone asks how to migrate.
license: MIT
metadata:
  author: toss
---

# react-simplikit-codemod

## Pick the codemod

| Situation                                                         | Codemod          |
| ----------------------------------------------------------------- | ---------------- |
| The project depends on `react-simplikit` 0.x and is moving to 1.x | `v0-to-v1`       |
| The project imports `@react-simplikit/mobile`                     | `mobile-to-root` |

A project on `@react-simplikit/mobile` that also wants v1 runs `mobile-to-root` first, then `v0-to-v1`: `v0-to-v1` only rewrites imports from `react-simplikit`.

Do **not** run either when the user only asked a question about the migration — answer from this file instead.

Both rewrite files in place and have no undo of their own, so the working tree must be committed or stashed first.

## v0-to-v1

Ships as `@react-simplikit/codemod`, a [Codemod](https://docs.codemod.com) workflow. The migration guide at https://react-simplikit.slash.page/migrating-to-v1 lists the same changes for people.

### Commands

Run from the project root. Preview first — this writes nothing and prints a diff:

```bash
npx @react-simplikit/codemod v0-to-v1 --dry-run --no-interactive
```

Apply:

```bash
npx @react-simplikit/codemod v0-to-v1 --no-interactive
```

Options after `v0-to-v1` go to the Codemod CLI: `-t <path>` runs on another folder, `--allow-dirty` skips the clean-tree check, and `--disable-analytics` turns off the CLI's usage analytics. Without `--allow-dirty`, a dirty tree makes `--no-interactive` fail instead of prompting. A second run changes nothing.

### What it rewrites

Only calls imported from `react-simplikit`, including aliased and namespace imports:

| Change                                | v0                                                                                                        | v1                                                                          |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| State hooks return `[value, actions]` | `const [open, setTrue, setFalse, toggle] = useBooleanState()`                                             | `const [open, { setTrue, setFalse, toggle }] = useBooleanState()`           |
|                                       | `const [token, setToken, refresh] = useStorageState('token')`                                             | `const [token, { setValue: setToken, refresh }] = useStorageState('token')` |
|                                       | `const { count, increment } = useCounter(0)`                                                              | `const [count, { increment }] = useCounter(0)`                              |
| Timer hooks take one options object   | `useInterval(poll, 1000)`, `useInterval(poll, { delay: 1000 })`                                           | `useInterval({ onTick: poll, delayMs: 1000 })`                              |
|                                       | `useTimeout(close, 3000)`                                                                                 | `useTimeout({ onTimeout: close, delayMs: 3000 })`                           |
| Time options end in `Ms`              | `timeThreshold` in `useDebouncedCallback`, `useThrottledCallback`, `useImpressionRef`, `<ImpressionArea>` | `debounceMs`, `throttleMs`, `timeThresholdMs`                               |
|                                       | `useLongPress(fn, { delay })`, `useAvoidKeyboard({ transitionDuration })`                                 | `delayMs`, `transitionDurationMs`                                           |
| Throttle `edges`                      | `useThrottle(fn, 100, { edges: ['leading'] })`                                                            | `useThrottle(fn, 100, { leading: true, trailing: false })`                  |
| `useDoubleClick` options              | `{ click, doubleClick, delay }`                                                                           | `{ onClick, onDoubleClick, delayMs }`                                       |

### Output

After the run, the CLI prints what it left alone under `Metrics:` → `manual-review`, one line per place:

```
Metrics:
  manual-review:
    hook=useCounter, file=src/Counter.tsx, line=12, reason=return-not-destructured: 1
```

| `reason`                              | Meaning                                                              | Fix by hand                                    |
| ------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------- |
| `options-not-inline`                  | The options are a variable                                           | Rename the keys where the object is built      |
| `options-spread`, `props-spread`      | A spread may still carry an old key                                  | Check the spread source; reported on every run |
| `options-computed-key`                | A computed key may be an old name                                    | Check the key's value                          |
| `delay-not-inline`                    | A timer delay comes from another file and may be v0's options object | Rewrite the call to the v1 options object      |
| `edges-not-inline`                    | `edges` is not an array literal                                      | Replace it with `leading` / `trailing`         |
| `return-not-destructured`             | A state hook's return value is used whole                            | Read `[value, actions]` from it                |
| `return-pattern-not-simple`           | The destructuring has a rest element or a default                    | Rewrite it to `[value, { ... }]`               |
| `require-not-followed`, `re-exported` | The hook comes through `require` or a re-export                      | Migrate the files that use it                  |

### After the run

1. Fix every `manual-review` line. The list is printed once and not saved, so read it from the run's output.
2. Upgrade: `npm install react-simplikit@^1` (or the project's package manager).
3. Run the type checker. Any remaining v0 call is now a type error.
4. Run the project's formatter: rewritten calls keep the surrounding indentation but are not reformatted.
5. Tell the user about the changes no codemod can make: `useScrollDirection`, `useVisualViewport`, `useNetworkStatus`, `usePageVisibility` and `useSafeAreaInset` return a fixed value on the first render; `useStorageState` throws on values JSON cannot hold unless `serializer` and `deserializer` are passed; `subscribeKeyboardHeight` calls back once right after subscribing unless `immediate: false` is passed.

A non-zero exit code means the workflow itself failed. The error is printed after the failing step; fix it and rerun.

## mobile-to-root

The project imports `@react-simplikit/mobile`, which is deprecated. Every export of that package now ships from the `react-simplikit` root entry.

Do **not** run this when the project has no `@react-simplikit/mobile` dependency.

### Commands

Preview first — this writes nothing:

```bash
npx react-simplikit-codemod mobile-to-root --dry-run --json
```

Apply:

```bash
npx react-simplikit-codemod mobile-to-root
```

Limit it to one directory:

```bash
npx react-simplikit-codemod mobile-to-root src
```

Skip paths, or leave manifests alone:

```bash
npx react-simplikit-codemod mobile-to-root --ignore 'legacy/**' --ignore '**/e2e/**'
npx react-simplikit-codemod mobile-to-root --no-package-json
```

`--debug` puts stack traces in the report and on stderr, including for files that could not be processed. The command never prompts and is safe to run twice, so it fits non-interactive and CI use.

### JSON output

`--json` writes only this object to stdout. Everything else goes to stderr.

```json
{
  "transform": "mobile-to-root",
  "dryRun": false,
  "scanned": 128,
  "changed": [
    {
      "kind": "source",
      "file": "src/a.tsx",
      "changes": [{ "line": 3, "kind": "import" }]
    },
    {
      "kind": "manifest",
      "file": "package.json",
      "dependencies": [
        {
          "field": "dependencies",
          "removed": "@react-simplikit/mobile",
          "added": "^0.2.0"
        }
      ]
    }
  ],
  "manual": [
    {
      "file": "src/a.tsx",
      "line": 4,
      "reason": "Left on its own line: `isIOS` already refers to a different import here..."
    },
    {
      "file": "package.json",
      "reason": "\"overrides\" still pins @react-simplikit/mobile..."
    }
  ],
  "failed": []
}
```

The object always carries these six keys.

`changed[].kind` is `source` or `manifest`, and it decides the rest of the entry: a `source` entry carries `changes`, a `manifest` entry carries `dependencies`. Neither key appears on the other kind, so branch on `kind` rather than testing an array for emptiness.

`changes[].kind` is one of `import`, `export`, `require`, `dynamic-import`, `import-type`, `mock`, `merge`.

`dependencies[].added` is `null` in two cases: the existing `react-simplikit` range already satisfies the floor and was left as it was, or no registry range could be written at all because the old dependency was pinned by a `workspace:`/`catalog:`/`file:` protocol. The second case always carries a `manual` note naming the field.

`manual[].line` is present only for a note about a specific import; manifest notes have no line.

`failed[]` holds the files that could not be read, parsed, or written. It is always present and usually empty.

### After the run

1. Act on every entry in `manual` by hand. Entries with a `line` mark an import the codemod deliberately left on its own — read the reason before merging it yourself, because merging it by hand can change what a name binds.
2. Run a bare `npm install` (or the equivalent) so the lockfile drops the old package. Do not run `npm install react-simplikit` — it would overwrite the range the codemod just wrote.
3. Run the project's formatter or linter fix (`eslint --fix`, say) on the changed files. Import-order rules place `react-simplikit` differently from `@react-simplikit/mobile`, so a sorted import block is usually out of order after the run.
4. Require `react-simplikit@0.2.0` or newer — the first release re-exporting the `SafeAreaInset` type from the root entry. An existing range below that floor is raised automatically; a `workspace:`/`catalog:`/`file:` protocol is kept and reported instead.

### Failure handling

| Exit code | What to do                                                                                                                                               |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `2`       | The invocation was wrong. stderr names the bad path or flag. Fix it and rerun                                                                            |
| `1`       | Some files could not be processed. They are listed in `failed` (or under **Could not be processed**); every other file was migrated. Fix those and rerun |
| `0`       | Done. Review the diff                                                                                                                                    |
