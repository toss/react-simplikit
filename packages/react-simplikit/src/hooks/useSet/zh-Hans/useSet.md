# useSet

一个将 Set 作为状态进行管理的 React Hook。它提供高效的状态管理和稳定的操作函数。

## 接口

```ts
function useSet<T>(initialState: SetOrValues<T> = new Set()): UseSetReturn<T>;
```

### 参数

<Interface
  name="initialState"
  type="SetOrValues<T>"
  description="初始 Set 状态（Set 对象或值数组）。"
/>

### 返回值

<Interface
  name=""
  type="UseSetReturn<T>"
  description="包含 Set 状态及其操作函数 的元组。"
  :nested="[
    {
      name: '[0]',
      type: 'Omit<Set<T>, \'add\' | \'clear\' | \'delete\'>',
      required: false,
      description: '当前的 Set 状态，隐藏了各种修改方法。',
    },
    {
      name: '[1].add',
      type: '(value: T) => void',
      required: false,
      description: '向 Set 中添加一个值。',
    },
    {
      name: '[1].remove',
      type: '(value: T) => void',
      required: false,
      description: '从 Set 中移除一个值。',
    },
    {
      name: '[1].toggle',
      type: '(value: T) => void',
      required: false,
      description: '值不存在则添加，存在则移除。',
    },
    {
      name: '[1].setAll',
      type: '(values: Set<T> | T[]) => void',
      required: false,
      description: '替换 Set 中的所有值。',
    },
    {
      name: '[1].reset',
      type: '() => void',
      required: false,
      description: '将 Set 重置为其初始状态。',
    },
  ]"
/>

## 示例

```tsx
import { useSet } from "react-simplikit";

function TagSelector() {
  const [selectedTags, { add, remove, toggle }] = useSet<string>(["react"]);

  return (
    <div>
      {["react", "vue", "svelte"].map((tag) => (
        <button key={tag} onClick={() => toggle(tag)}>
          {selectedTags.has(tag) ? "✓" : ""} {tag}
        </button>
      ))}
    </div>
  );
}
```
