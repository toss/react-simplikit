---
description: 通过 AI 编程 agent 使用 react-simplikit
---

# AI 集成

react-simplikit 提供了多种资料，帮助 AI 编程 agent（Claude Code、Codex、Cursor 等）在手写 Hook 之前找到合适的现有 Hook。

## Agent skill

`react-simplikit` skill 包含所有 Hook、组件和工具函数的目录及一句话说明，以及 import 和 SSR 规则。安装后，agent 可以在编写防抖、节流、外部点击检测、键盘避让等逻辑前查阅目录，并在使用 API 前阅读附带的参考文档。

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

Skill 由这些文档页面生成，以保持与库的内容一致。源代码位于 [`packages/plugin`](https://github.com/toss/react-simplikit/tree/main/packages/plugin)。

## llms.txt

文档也以 agent 可以直接读取的格式发布。

- [`/llms.txt`](https://react-simplikit.slash.page/llms.txt) — 所有页面的索引和一句话摘要
- [`/llms-full.txt`](https://react-simplikit.slash.page/llms-full.txt) — 合并为单个文件的完整文档
- 将页面 URL 的后缀改为 `.md` 即可获取原始 Markdown，例如： [`/hooks/useDebounce.md`](https://react-simplikit.slash.page/hooks/useDebounce.md)

## Context7

react-simplikit 已在 [Context7](https://context7.com/toss/react-simplikit) 中以 `/toss/react-simplikit` 收录。使用 Context7 MCP 服务器的 agent 无需额外配置即可查询文档。

## 验证 agent 访问

1. 让 agent 使用已安装的 skill 或 [llms.txt](https://react-simplikit.slash.page/llms.txt)，为具体任务查找 API，例如将搜索回调延迟 300 ms。
2. 让它读取链接中的 [useDebounce Markdown 参考](https://react-simplikit.slash.page/hooks/useDebounce.md)，并在编写代码前说明 import、参数、默认值和清理行为。
3. 确认它从 `react-simplikit` 使用具名导入，能够区分延迟回调与延迟值，并说明取消待执行回调不会中止已经开始的请求。
4. 检查已安装的包版本是否提供该 API，并在项目中运行代码。网站提供最新文档；查找正确并不代表与旧版本兼容。

如果 agent 无法加载 skill 或访问网站，请直接提供相关 Markdown 参考。仅安装 skill 不能证明 agent 已读取文档。生成的 skill 目录列出了 API 条目；描述所需行为时，可以参考[常见使用场景](/zh-Hans/use-cases)。
