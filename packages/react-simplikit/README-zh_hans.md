# react-simplikit

[![npm version](https://img.shields.io/npm/v/react-simplikit.svg)](https://www.npmjs.com/package/react-simplikit)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/react-simplikit/blob/main/LICENSE)
[![codecov](https://codecov.io/gh/toss/react-simplikit/graph/badge.svg?token=RHVOZ3J3TU)](https://codecov.io/gh/toss/react-simplikit)

[English](./README.md) | [한국어](./README-ko_kr.md) | [日本語](./README-ja_jp.md) | 简体中文 | [Español](./README-es.md)

一个轻量、零依赖的 React 工具库，提供 Hook、组件和工具函数。

## 特性

- **零依赖** - 极其轻量
- **100% TypeScript** - 完整的类型安全
- **100% 测试覆盖率** - 可靠且稳定
- **SSR 安全** - 可在 Next.js 等 SSR 框架中使用
- **支持 tree shaking** - 只把你用到的部分打进包里

## 安装

```bash
npm install react-simplikit
# or
yarn add react-simplikit
# or
pnpm add react-simplikit
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

## 包含的内容

- **Hook** — 状态与逻辑（`useToggle`、`useDebounce`、`useList` 等）、浏览器事件（`useIntersectionObserver`、`useOutsideClickEffect` 等）以及移动端 Web（`useAvoidKeyboard`、`useSafeAreaInset`、`useVisualViewport` 等）
- **组件** — `SwitchCase`、`Separated`、`ImpressionArea`
- **工具函数** — `buildContext`、`mergeProps`、`mergeRefs`，以及 `isIOS`、`getKeyboardHeight` 这类移动端 Web 辅助函数

带一句话说明的完整列表见[参考页面](https://react-simplikit.slash.page/zh-Hans/reference.html)。

## 文档

完整文档请访问 [react-simplikit.slash.page](https://react-simplikit.slash.page/zh-Hans)。

## 贡献

我们欢迎贡献！请查看我们的[贡献指南](https://github.com/toss/react-simplikit/blob/main/.github/CONTRIBUTING.md)。

## 许可证

MIT © Viva Republica, Inc. 详情请参见 [LICENSE](https://github.com/toss/react-simplikit/blob/main/LICENSE)。
