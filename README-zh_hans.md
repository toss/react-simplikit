![react-simplikit](./public/images/og.png)

# react-simplikit &middot; [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/react-simplikit/blob/main/LICENSE) [![codecov](https://codecov.io/gh/toss/react-simplikit/graph/badge.svg?token=RHVOZ3J3TU)](https://codecov.io/gh/toss/react-simplikit) [![Discord Badge](https://discord.com/api/guilds/1281071127052943361/widget.png?style=shield)](https://discord.gg/vGXbVjP2nY)

[English](./README.md) | [한국어](./README-ko_kr.md) | [日本語](./README-ja_jp.md) | 简体中文 | [Español](./README-es.md)

一组轻量、零依赖的 React 工具函数，帮你构建健壮的应用。

## 包

| 包                                            | 说明                                                                                       | 版本                                                                                                                      |
| --------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| [react-simplikit](./packages/react-simplikit) | React Hook、组件和工具函数：状态与逻辑、浏览器事件，以及移动端 Web（键盘、安全区域、视口） | [![npm](https://img.shields.io/npm/v/react-simplikit.svg)](https://www.npmjs.com/package/react-simplikit)                 |
| [react-simplikit-codemod](./packages/codemod) | 为升级 `react-simplikit` 而改写代码库的 codemod                                            | [![npm](https://img.shields.io/npm/v/react-simplikit-codemod.svg)](https://www.npmjs.com/package/react-simplikit-codemod) |

## 特性

- **零依赖** - 极其轻量
- **100% TypeScript** - 完整的类型安全
- **100% 测试覆盖率** - 可靠且稳定
- **SSR 安全** - 可在 Next.js 等 SSR 框架中使用
- **支持 tree shaking** - 只把你用到的部分打进包里

## 安装

```bash
npm install react-simplikit
```

## 快速开始

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

### 让固定元素始终位于软键盘上方

```tsx
import { useAvoidKeyboard } from 'react-simplikit';

function ChatInput() {
  const { style } = useAvoidKeyboard();

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, ...style }}>
      <input type="text" placeholder="输入消息..." />
    </div>
  );
}
```

## 文档

完整文档请访问 [react-simplikit.slash.page](https://react-simplikit.slash.page/zh-Hans)。

## 仓库结构

```
packages/
├── react-simplikit/    # 库本身
├── codemod/            # react-simplikit-codemod
└── plugin/             # 面向 AI 编程助手的 agent skill
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
