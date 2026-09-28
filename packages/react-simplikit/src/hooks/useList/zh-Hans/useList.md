# useList

一个将数组作为状态进行管理的 React Hook。它提供高效的状态管理和稳定的操作函数。

## 接口

```ts
function useList<T>(initialState: T[] = []): UseListReturn<T>;
```

### 参数

<Interface name="initialState" type="T[]" description="初始数组状态。" />

### 返回值

<Interface
  name=""
  type="UseListReturn<T>"
  description="包含数组状态及其操作函数的对象。"
  :nested="[
    {
      name: 'list',
      type: 'ReadonlyArray<T>',
      required: false,
      description: '当前的数组状态。',
    },
    {
      name: 'push',
      type: '(value: T) => void',
      required: false,
      description: '将一个值追加到列表末尾。',
    },
    {
      name: 'insertAt',
      type: '(index: number, value: T) => void',
      required: false,
      description: '在指定索引处插入一个值。',
    },
    {
      name: 'updateAt',
      type: '(index: number, value: T) => void',
      required: false,
      description: '更新指定索引处的值。',
    },
    {
      name: 'removeAt',
      type: '(index: number) => void',
      required: false,
      description: '移除指定索引处的值。',
    },
    {
      name: 'setAll',
      type: '(values: T[]) => void',
      required: false,
      description: '用新数组替换整个列表。',
    },
    {
      name: 'reset',
      type: '() => void',
      required: false,
      description: '将列表重置为其初始状态。',
    },
  ]"
/>

## 示例

```tsx
const { list, push, insertAt, updateAt, removeAt, setAll, reset } =
  useList<string>(['apple', 'banana']);

// Add an item
push('cherry');

// Insert at index
insertAt(1, 'grape');

// Update at index
updateAt(0, 'orange');

// Remove at index
removeAt(2);

// Replace all
setAll(['kiwi', 'mango']);

// Reset to initial state
reset();
```
