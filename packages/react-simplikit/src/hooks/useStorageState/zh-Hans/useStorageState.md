# useStorageState

`useStorageState` 是一个功能类似于 `useState`、但会将状态值持久化到浏览器存储中的 React Hook。该值会在页面刷新后保留，并且在配合 `localStorage` 使用时可以在标签页之间共享。

如果不传入 `serializer` 和 `deserializer`，值会以 JSON 形式存储，因此值的每一层都必须能够序列化为 JSON：值中任何位置出现 `Date`、`Map`、类实例或函数时，设置该值都会抛出错误，`defaultValue` 则会在挂载时检查。要存储其他类型，请同时传入这两个函数。从存储中读回的字符串不会经过校验。

## 接口

```ts
function useStorageState<T>(
  key: string,
  options?: Object
): readonly [state: T | undefined, actions: StorageStateActions<T | undefined>];
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
      type: '(value: T) => string',
      required: false,
      description: '将值转换为字符串的函数。需要与 <code>deserializer</code> 一起传入。',
    },
    {
      name: 'options.deserializer',
      type: '(value: string) => T',
      required: false,
      description: '将存储的字符串还原为值的函数。需要与 <code>serializer</code> 一起传入。',
    },
  ]"
/>

### 返回值

<Interface
  name=""
  type="readonly [state: T | undefined, actions: StorageStateActions<T | undefined>]"
  description="包含状态和状态修改操作的元组。"
  :nested="[
    {
      name: 'state',
      type: 'T | undefined',
      required: false,
      description: '从存储中检索到的当前状态值。传入 <code>defaultValue</code> 时类型为 <code>T</code>。',
    },
    {
      name: 'actions.setValue',
      type: '(value: SetStateAction<T | undefined>) => void',
      required: false,
      description: '更新并持久化状态的函数。',
    },
    {
      name: 'actions.refresh',
      type: '() => void',
      required: false,
      description: '从存储中刷新状态的函数。',
    },
  ]"
/>

## 示例

```tsx
// 具有持久化状态的计数器
import { useStorageState } from 'react-simplikit';

function Counter() {
  const [count, { setValue }] = useStorageState('counter', {
    defaultValue: 0,
  });

  return (
    <button onClick={() => setValue(prev => prev + 1)}>Count: {count}</button>
  );
}
```
