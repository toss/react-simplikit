---
description: Use react-simplikit with AI coding agents
---

# AI Integration

react-simplikit ships a few things that let an AI coding agent (Claude Code, Codex, Cursor and others) find the right hook instead of hand-writing it.

## Agent skill

The `react-simplikit` skill is a short catalog of every hook, component and util with a one-line description, plus rules about imports and SSR. Once installed, the agent consults it before writing debounce, throttle, click-outside, keyboard-avoidance and similar logic, and reads the bundled reference page before using an entry.

::: code-group

```sh [skills.sh]
npx skills add toss/react-simplikit --skill react-simplikit
```

```sh [Claude Code]
claude plugin marketplace add https://github.com/toss/react-simplikit --sparse .claude-plugin packages/plugin
claude plugin install react-simplikit@react-simplikit
```

```sh [Codex]
codex plugin marketplace add https://github.com/toss/react-simplikit
# then install "react-simplikit" from the plugin UI
```

:::

The skill is generated from these documentation pages, so it stays in sync with the library. Its source lives in [`packages/plugin`](https://github.com/toss/react-simplikit/tree/main/packages/plugin).

## llms.txt

The documentation is also published in the formats agents read directly:

- [`/llms.txt`](https://react-simplikit.slash.page/llms.txt) — an index of every page with a one-line summary
- [`/llms-full.txt`](https://react-simplikit.slash.page/llms-full.txt) — the whole documentation in one file
- Any page with a `.md` suffix returns raw Markdown, for example [`/hooks/useDebounce.md`](https://react-simplikit.slash.page/hooks/useDebounce.md)

## Context7

react-simplikit is indexed on [Context7](https://context7.com/toss/react-simplikit) as `/toss/react-simplikit`. Agents with the Context7 MCP server can query the documentation from there without any setup on your side.

## Verify agent access

1. Ask the agent to find an API for a concrete task, such as delaying a search callback by 300 ms, using the installed skill or [llms.txt](https://react-simplikit.slash.page/llms.txt).
2. Have it read the linked [useDebounce Markdown reference](https://react-simplikit.slash.page/hooks/useDebounce.md), then report the import, parameters, defaults and cleanup behavior before writing code.
3. Confirm that it uses a named import from `react-simplikit`, distinguishes a delayed callback from a delayed value, and explains that cancelling a pending callback does not abort an already-started request.
4. Check the API against your installed package version and run the resulting code in your project. The website follows the latest documentation; a correct lookup does not prove compatibility with an older installation.

If the agent cannot load its skill or access the site, give it the relevant Markdown reference directly. Installation alone does not prove that an agent read the documentation. The generated skill catalog lists API entries; use [Common use cases](/use-cases) to describe the behavior you need.
