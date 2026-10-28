# usePageVisibilityEffect

`usePageVisibilityEffect` 是一个监听文档可见性状态变化并触发回调的 React Hook。在 v0 中，这个 Hook 名为 `useVisibilityEvent`。旧名称仍然可用，但已弃用。

## 接口

```ts
function usePageVisibilityEffect(
  callback: (visibilityState: 'visible' | 'hidden') => void,
  options?: object
): void;
```

### 参数

<Interface
  required
  name="callback"
  type="(visibilityState: 'visible' | 'hidden') => void"
  description="当可见性状态变化时被调用的函数。它接收当前的可见性状态（'visible' 或 'hidden'）作为参数。"
/>

<Interface
  name="options"
  type="object"
  description="Hook 的可选配置。"
  :nested="[
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        '如果为 true，回调会在挂载时立即以当前的可见性状态被调用。',
    },
  ]"
/>

### 返回值

此函数不返回任何内容。

## 示例

```tsx
import { usePageVisibilityEffect } from 'react-simplikit';

function Component() {
  usePageVisibilityEffect(visibilityState => {
    console.log(`Document is now ${visibilityState}`);
  });

  return <p>Check the console for visibility changes.</p>;
}
```
