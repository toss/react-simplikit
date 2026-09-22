# useStorageState

`useStorageState` 是一个功能类似于 `useState`、但会将状态值持久化到浏览器存储中的 React Hook。该值会在页面刷新后保留，并且在配合 `localStorage` 使用时可以在标签页之间共享。

## 接口

```ts
function useStorageState<T>(
  key: string,
  options?: Object
): readonly [
  state: Serializable<T> | undefined,
  setState: (value: SetStateAction<Serializable<T> | undefined>) => void,
  refreshState: () => void,
];
```

### 参数

<Interface
  required
  name="key"
  type="string"
  description="用于在存储中保存值的键。"
/>

<Interface
  name="options"
  type="Object"
  description="用于存储行为的配置选项。"
  :nested="[
    {
      name: 'options.storage',
      type: 'Storage',
      required: false,
      defaultValue: 'localStorage',
      description:
        '存储类型（<code>localStorage</code> 或 <code>sessionStorage</code>）。默认为 <code>localStorage</code>。',
    },
    {
      name: 'options.defaultValue',
      type: 'T',
      required: false,
      description: '未找到现有值时的初始值。',
    },
    {
      name: 'options.serializer',
      type: 'Function',
      required: false,
      description: '将状态值序列化为字符串的函数。',
    },
    {
      name: 'options.deserializer',
      type: 'Function',
      required: false,
      description: '将状态值从字符串反序列化的函数。',
    },
  ]"
/>

### 返回值

<Interface
  name=""
  type="readonly [state: Serializable<T> | undefined, setState: (value: SetStateAction<Serializable<T> | undefined>) => void, refreshState: () => void]"
  description="一个元组："
  :nested="[
    {
      name: 'state',
      type: 'Serializable<T> | undefined',
      required: false,
      description: '从存储中检索到的当前状态值。',
    },
    {
      name: 'setState',
      type: '(value: SetStateAction<Serializable<T> | undefined>) => void',
      required: false,
      description: '更新并持久化状态的函数。',
    },
    {
      name: 'refreshState',
      type: '() => void',
      required: false,
      description: '从存储中刷新状态的函数。',
    },
  ]"
/>

## 示例

```tsx
// Counter with persistent state
import { useStorageState } from 'react-simplikit';

function Counter() {
  const [count, setCount] = useStorageState<number>('counter', {
    defaultValue: 0,
  });

  return (
    <button onClick={() => setCount(prev => prev + 1)}>Count: {count}</button>
  );
}
```
