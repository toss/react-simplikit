![react-simplikit](./public/images/og.png)

# react-simplikit &middot; [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/react-simplikit/blob/main/LICENSE) [![codecov](https://codecov.io/gh/toss/react-simplikit/graph/badge.svg?token=RHVOZ3J3TU)](https://codecov.io/gh/toss/react-simplikit) [![Discord Badge](https://discord.com/api/guilds/1281071127052943361/widget.png?style=shield)](https://discord.gg/vGXbVjP2nY)

[English](./README.md) | [한국어](./README-ko_kr.md) | [日本語](./README-ja_jp.md) | 简体中文 | [Español](./README-es.md)

一组轻量、零依赖的 React 工具函数，帮你构建健壮的应用。

## 包

| 包                                            | 说明                                                                     | 版本                                                                                                      |
| --------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| [react-simplikit](./packages/react-simplikit) | Universal hooks - 状态/逻辑 Hook 与移动端 Web 工具函数，都从单一入口提供 | [![npm](https://img.shields.io/npm/v/react-simplikit.svg)](https://www.npmjs.com/package/react-simplikit) |

> **注意**：所有 Hook 都从单一的 `react-simplikit` 入口提供，其中也包括移动端 Web 工具函数（viewport、keyboard、scroll）。它取代了已弃用的 `@react-simplikit/mobile` 包。Hook 只在函数体内部才会触碰浏览器 API，因此从根入口导入在 React Native 和 SSR 中同样安全。

## 特性

- **零依赖** - 极其轻量
- **100% TypeScript** - 完整的类型安全
- **100% 测试覆盖率** - 可靠且稳定
- **SSR 安全** - 可在 Next.js 等 SSR 框架中使用
- **支持 tree shaking** - 只把你用到的部分打进包里

## 安装

```bash
# 一次安装即可同时使用根入口的 Hook 和移动端子路径
npm install react-simplikit
```

## 快速开始

### react-simplikit

```tsx
import { useState } from 'react';
import { useDebounce } from 'react-simplikit';

function SearchInput() {
  const [query, setQuery] = useState('');

  const debouncedSearch = useDebounce((value: string) => {
    // 实际的 API 调用
    searchAPI(value);
  }, 300);

  return (
    <input
      value={query}
      onChange={e => {
        setQuery(e.target.value);
        debouncedSearch(e.target.value);
      }}
      placeholder="输入搜索关键词"
    />
  );
}
```

防抖后的函数会提供 `.cancel()`，并且在组件卸载时自动取消待执行的调用。

### 移动端 Web 工具函数

```tsx
import { useAvoidKeyboard, useBodyScrollLock } from 'react-simplikit';

function ChatInput() {
  const { style } = useAvoidKeyboard();

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, ...style }}>
      <input type="text" placeholder="输入消息..." />
    </div>
  );
}

// `useBodyScrollLock` 会在组件挂载期间锁定 body 的滚动，
// 并在卸载时自动解锁。请只在模态框打开时渲染它。
function BodyScrollLock() {
  useBodyScrollLock();
  return null;
}
```

## 文档

完整文档请访问 [react-simplikit.slash.page](https://react-simplikit.slash.page/zh-Hans)。

## 仓库结构

```
packages/
└── react-simplikit/    # react-simplikit (hooks, components, utils; 移动端 Web 工具函数位于 src/mobile)
```

## 贡献

我们欢迎每一个人的贡献！请查看我们的贡献指南。

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## 许可证

MIT © Viva Republica, Inc. 详情请参见 [LICENSE](./LICENSE)。

<a title="Toss" href="https://toss.im">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://static.toss.im/logos/png/4x/logo-toss-reverse.png">
    <img alt="Toss" src="https://static.toss.im/logos/png/4x/logo-toss.png" width="100">
  </picture>
</a>
