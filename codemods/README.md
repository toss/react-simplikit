# Codemods

Each folder here is a [Codemod](https://docs.codemod.com) package: a workflow of jssg (JavaScript ast-grep) transforms that can be published to the Codemod registry and run with `npx codemod`. ESLint ([eslint/codemods](https://github.com/eslint/codemods)) and Node.js ([nodejs/userland-migrations](https://github.com/nodejs/userland-migrations)) ship their migrations the same way.

Every react-simplikit codemod lives here. They sit at the repository root, apart from `packages/`, because they are published to the Codemod registry, not npm. `mobile-to-root` predates this folder and still ships on npm as the `react-simplikit-codemod` CLI in `packages/codemod`; it moves here next, and that package is retired once the registry release is in place.

## Layout

```
codemods/
├── test.mjs                       # runs every transform against its fixtures
└── v0-to-v1/
    ├── codemod.yaml               # registry metadata
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
4. Run `node codemods/test.mjs`. It fails when `workflow.yaml` misses either step or points at a script that does not exist.

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

The Codemod CLI is pinned in `test.mjs` and run through `npx` instead of being a devDependency: it ships a ~140MB native binary per platform, which the committed yarn cache cannot hold.

## Running a codemod from source

Commit or stash first; the CLI refuses to run on files Git does not track.

```bash
npx codemod@1.18.6 workflow run -w codemods/v0-to-v1/workflow.yaml -t path/to/project
```
