---
description: 如何安装 react-simplikit
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
import { useToggle } from 'react-simplikit';
```

所有 Hook 都支持 tree shaking，因此只有你真正用到的部分才会被打进包里。
