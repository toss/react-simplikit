# react-simplikit plugin

Agent skill for [react-simplikit](https://react-simplikit.slash.page): a catalog of every hook, component and util with a one-line description, import and SSR rules, and a reference page per entry. With it installed, an agent checks the library before hand-writing debounce, throttle, click-outside, keyboard-avoidance and similar logic.

The skill is generated from the documentation pages in `packages/react-simplikit/src` — see [Contributing](#contributing).

## Install

### skills.sh (Claude Code, Codex, Cursor and other agents)

```bash
npx skills add toss/react-simplikit --skill react-simplikit
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

## What the skill contains

- `SKILL.md` — when to use the library, import and SSR rules, a "common needs → use" table, and the full catalog grouped by category (hooks, components, utils, mobile hooks, mobile utils). Everything is imported from `react-simplikit`; the mobile categories only say what an entry assumes.
- `references/<name>.md` — the documentation page of each entry: signature, parameters, return value, example.

## Contributing

`SKILL.md` and `references/` are generated. Do not edit them by hand:

- Wording of the rules and the "common needs" table lives in `.scripts/commands/generateSkill/template.md`.
- Catalog descriptions come from each entry's documentation page (`<name>.md` next to its source), which `yarn docs:gen <name>` writes from the JSDoc.
- Run `yarn skill:gen` to regenerate (it also runs at the end of `yarn docs:gen`), then `yarn test:skill` to check the result. CI fails if the committed skill differs from a fresh generation.

## License

MIT
