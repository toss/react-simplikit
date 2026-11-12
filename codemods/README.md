# Codemods

Each folder here is a [Codemod](https://docs.codemod.com) workflow of jssg (JavaScript ast-grep) transforms. ESLint ([eslint/codemods](https://github.com/eslint/codemods)) and Node.js ([nodejs/userland-migrations](https://github.com/nodejs/userland-migrations)) write their migrations the same way.

Every react-simplikit codemod lives here. The folder is one npm package, `@react-simplikit/codemod`: `cli.mjs` runs `<codemod>/workflow.yaml` with the Codemod CLI, so users run `npx @react-simplikit/codemod v0-to-v1`. It ships on npm rather than the Codemod registry because the registry only accepts a scope that a GitHub organization of the same name verifies, and there is no `react-simplikit` organization. The package stays `private` until its first release.

`mobile-to-root` predates this folder and still ships as the `react-simplikit-codemod` CLI in `packages/codemod`; it moves here next, and that package is retired after that.

## Layout

```
codemods/
├── package.json                   # @react-simplikit/codemod
├── cli.mjs                        # the bin: runs <codemod>/workflow.yaml
├── test.mjs                       # runs every transform against its fixtures
└── v0-to-v1/
    ├── workflow.yaml              # one step per transform
    ├── README.md
    ├── scripts/<transform>.ts     # one breaking change per script
    ├── utils/                     # helpers shared by this codemod's scripts
    └── tests/<language>/<transform>/<case>/
        ├── input.tsx              # input.ts under tests/typescript
        ├── expected.tsx
        └── metrics.json           # only when the case reports something
```

## Adding a transform

1. Write `scripts/<transform>.ts`. Export a default `transform(root)` that returns the new source, or `null` when nothing changed.
2. Add fixtures under `tests/tsx/<transform>/`. Cover at least: the change itself, an aliased import, a same-named function from another module (left alone), a case that cannot be rewritten (left alone and reported), and already-migrated code (left alone). Cases only the `typescript` grammar can parse, such as `<T>value`, go under `tests/typescript/<transform>/` as `.ts` files.
3. Add the script to `workflow.yaml` twice, once with `language: tsx` and once with `language: typescript`. The `tsx` grammar handles JSX, the `typescript` grammar handles `<T>value` assertions, and neither parses both.
4. Run `node codemods/test.mjs`. It fails when `workflow.yaml` misses either step or points at a script that does not exist, and it dry-runs `cli.mjs` over the fixtures.

## Rules every transform follows

- **Only touch react-simplikit.** Resolve the local name through `utils/imports.ts` first, so an aliased import is handled and an unrelated function with the same name is not.
- **Leave what it cannot rewrite safely, and report it.** Increment the `manual-review` metric with `hook`, `reason`, `file: root.relativeFilename()` and `line`. Codemod prints it after the run, and the fixture's `metrics.json` pins it. Keep `useMetricAtom` in the script itself: Codemod finds metric names there, not in `utils/`.
- **Be idempotent.** A second run changes nothing.

## Testing

```bash
node codemods/test.mjs
```

`yarn test:codemod`, which CI runs, includes it.

Fixtures are compared byte for byte, so `.prettierignore` skips them. To regenerate `expected.tsx` and `metrics.json` after an intended change, run `npx codemod@1.18.6 jssg test -u -l <language> <script> <tests/language/transform>`, then review the diff.

The Codemod CLI is pinned in `test.mjs` and `cli.mjs` and run through `npx` instead of being a dependency: it ships a ~140MB native binary per platform, which the committed yarn cache cannot hold. Bump both pins together.

## Running a codemod from source

Commit or stash first; the CLI refuses to run on files Git does not track.

```bash
node codemods/cli.mjs v0-to-v1 -t path/to/project
```
