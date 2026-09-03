---
description: 如何为移动端 Web 安装 react-simplikit
---

# 安装

你可以使用自己喜欢的包管理器，从 [npm](https://npmjs.com/package/react-simplikit) 安装 `react-simplikit`。

::: code-group

```sh [npm]
npm install react-simplikit
```

```sh [pnpm]
pnpm add react-simplikit
```

```sh [yarn]
yarn add react-simplikit
```

```sh [bun]
bun add react-simplikit
```

:::

## 环境要求

- React 18 或更高版本
- TypeScript 4.7 或更高版本（推荐）

## 用法

直接从这个包中导入 Hook：

```tsx
import { useKeyboardHeight, useAvoidKeyboard } from 'react-simplikit';
```

所有 Hook 都支持 tree shaking，因此只有你真正用到的部分才会被打进包里。

## 从 `@react-simplikit/mobile` 迁移

`@react-simplikit/mobile` 导出的所有内容现在都由 `react-simplikit` 提供。codemod 会就地改写 import 语句和 `package.json` 中的依赖：

```sh
npx react-simplikit-codemod mobile-to-root
```

之后请对改动过的文件运行格式化工具或 linter 的 fix：import 排序规则会把 `react-simplikit` 和 `@react-simplikit/mobile` 放在不同的位置。
