# react-simplikit plugin

Agent skills for [react-simplikit](https://react-simplikit.slash.page). Two ship in this plugin:

- **`react-simplikit`** — a catalog of every hook, component and util with a one-line description, import and SSR rules, and a reference page per entry. With it installed, an agent checks the library before hand-writing debounce, throttle, click-outside, keyboard-avoidance and similar logic.
- **`react-simplikit-codemod`** — how to migrate a codebase off the `@react-simplikit/mobile` package with `npx react-simplikit-codemod mobile-to-root`, including the JSON report the CLI emits and what to do with each exit code.

## Install

### skills.sh (Claude Code, Codex, Cursor and other agents)

```bash
npx skills add toss/react-simplikit --skill react-simplikit
npx skills add toss/react-simplikit --skill react-simplikit-codemod
```

### Claude Code

```bash
# 1. Add this plugin's marketplace (sparse-checkout keeps the clone minimal)
claude plugin marketplace add https://github.com/toss/react-simplikit \
  --sparse .claude-plugin packages/plugin

# 2. Install the plugin
claude plugin install react-simplikit@react-simplikit
```

### Codex

```bash
codex plugin marketplace add https://github.com/toss/react-simplikit
```

Then install `react-simplikit` from the Codex plugin UI.

## Uninstall

```bash
# Claude Code
claude plugin uninstall react-simplikit@react-simplikit
claude plugin marketplace remove react-simplikit

# Codex
codex plugin marketplace remove react-simplikit
```

## Upgrading from react-design-philosophy

This marketplace used to publish the `react-design-philosophy` plugin (skills `react-design-principles`, `react-hook-review`, `react-hook-writing`). Those were general React guidance rather than anything specific to this library, and they have been removed. Because the marketplace name changed, an existing installation is not updated in place — remove it, then follow the install steps above:

```bash
claude plugin uninstall react-design-philosophy@react-design-philosophy
claude plugin marketplace remove react-design-philosophy
```

## What each skill contains

`skills/react-simplikit/`

- `SKILL.md` — when to use the library, import and SSR rules, a "common needs → use" table, and the full catalog grouped by category (hooks, components, utils, mobile hooks, mobile utils). Everything is imported from `react-simplikit`; the mobile categories only say what an entry assumes.
- `references/<name>.md` — the documentation page of each entry: signature, parameters, return value, example.

`skills/react-simplikit-codemod/`

- `SKILL.md` — preconditions, the commands and their flags, the shape of the `--json` report, the manual follow-ups to act on afterwards, and what each exit code means. It has no `references/`.

## Contributing

The two skills are maintained differently.

**`skills/react-simplikit/` is generated. Do not edit it by hand:**

- Wording of the rules and the "common needs" table lives in `.scripts/commands/generateSkill/template.md`.
- Catalog descriptions come from each entry's documentation page (`<name>.md` next to its source), which `yarn docs:gen <name>` writes from the JSDoc.
- Run `yarn skill:gen` to regenerate (it also runs at the end of `yarn docs:gen`), then `yarn test:skill` to check the result. CI fails if the committed skill differs from a fresh generation.

**`skills/react-simplikit-codemod/` is hand-written.** It documents the CLI in `packages/codemod`, so a change to the CLI's flags, JSON report or exit codes has to be carried into it by hand. `yarn test:skill` checks its frontmatter and length but cannot tell whether it still matches the CLI.

## License

MIT
