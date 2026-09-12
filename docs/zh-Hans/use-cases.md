---
description: 根据要解决的问题选择 React 工具函数
---

# 常见使用场景

先根据所需行为选择 API，再查阅参考文档中的参数和边界情况。尝试示例前，请先[安装 react-simplikit](/zh-Hans/installation)。

## 选择 API

| 问题                   | API                                                           | 提供的功能                             |
| ---------------------- | ------------------------------------------------------------- | -------------------------------------- |
| 显示或隐藏内容         | [useToggle](/zh-Hans/hooks/useToggle)                         | 布尔状态和切换函数                     |
| 等待用户停止输入       | [useDebouncedValue](/zh-Hans/hooks/useDebouncedValue)         | 延迟更新的状态副本，输入框仍然即时响应 |
| 延迟调用回调           | [useDebounce](/zh-Hans/hooks/useDebounce)                     | 带有 `.cancel()` 方法的可调用函数      |
| 限制回调频率           | [useThrottledCallback](/zh-Hans/hooks/useThrottledCallback)   | 按设定间隔限制调用频率的回调           |
| 刷新后保留状态         | [useStorageState](/zh-Hans/hooks/useStorageState)             | 保存在浏览器存储中的状态               |
| 响应元素外部的点击     | [useOutsideClickEffect](/zh-Hans/hooks/useOutsideClickEffect) | 元素外部点击订阅                       |
| 让输入框保持在键盘上方 | [useAvoidKeyboard](/zh-Hans/hooks/useAvoidKeyboard)           | 用于定位固定元素的样式                 |
| 在子元素之间插入分隔符 | [Separated](/zh-Hans/components/Separated)                    | 末尾没有分隔符                         |
| 为一个元素连接多个 ref | [mergeRefs](/zh-Hans/utils/mergeRefs)                         | 向各个 ref 转发的单个 ref 回调         |

## 显示和隐藏详情

在 React 应用中渲染 `<Details />`。点击按钮会同时切换内容显示和展开状态。

```tsx
import { useToggle } from 'react-simplikit';

export function Details() {
  const [open, toggle] = useToggle(false);

  return (
    <section>
      <button type="button" aria-expanded={open} onClick={toggle}>
        Details
      </button>
      {open && <p>Delivery takes 3–5 days.</p>}
    </section>
  );
}
```

## 停止输入后筛选

在 React 应用中渲染 `<FruitSearch />`。输入 `ap` 后，输入框立即更新；如果 300 ms 内没有再次输入，列表就会显示 Apple。此示例使用本地数据，无需服务器。

```tsx
import { useState } from 'react';
import { useDebouncedValue } from 'react-simplikit';

const fruits = ['Apple', 'Banana', 'Orange'];

export function FruitSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);
  const results = fruits.filter(fruit =>
    fruit.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  return (
    <section>
      <label>
        Search fruit
        <input value={query} onChange={event => setQuery(event.target.value)} />
      </label>
      <ul aria-live="polite">
        {results.map(fruit => (
          <li key={fruit}>{fruit}</li>
        ))}
      </ul>
    </section>
  );
}
```

需要用于渲染的值时，使用 [useDebouncedValue](/zh-Hans/hooks/useDebouncedValue)。需要通过事件安排回调时，使用 [useDebounce](/zh-Hans/hooks/useDebounce)。防抖本身不会加快耗时计算。

## SSR 与清理

- 在 React 组件或自定义 Hook 的顶层调用 Hook。如果框架使用 Server Components，请将这些交互式示例放在 Client Component（`'use client'`）中。

- `useDebouncedValue` 在服务端和首次渲染时原样返回传入的值。为服务端和客户端提供相同的初始值，不要在渲染过程中读取 `window` 或存储来构造该值。

- `useStorageState` 使用 `defaultValue` 作为服务端快照和 hydration 的值，随后在客户端读取浏览器存储。卸载时会移除存储监听器。

- `useDebounce` 在组件卸载或防抖实例变化时取消待执行的调用，但不会取消已经开始的网络请求。应用需要处理请求取消或过期响应。

- 浏览器测量值可能在挂载后发生变化。请在[移动 Web](/zh-Hans/mobile-web) 指南和各 API 参考文档中查看初始值及平台限制。

## 后续步骤

在[完整 API 参考](/zh-Hans/reference) 中查找其他工具，或设置 [AI 集成](/zh-Hans/ai-integration)，让 agent 查阅同样的文档。
