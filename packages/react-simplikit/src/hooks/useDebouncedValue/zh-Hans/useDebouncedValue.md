# useDebouncedValue

`useDebouncedValue` 是一个返回所给值防抖副本 的 React Hook。调用方始终拥有该状态；Hook 只延迟返回值的跟随速度。返回值会在最后一次变化后 `wait` 毫秒更新，这适用于从快速变化的状态中推导搜索查询或校验输入。

当组件卸载时，待执行的更新会被取消。该示例展示了延迟后的查询，无需搜索服务或额外的组件。

在首次渲染时和服务端，该值会原样返回。挂载时永远不会安排变化，因此使用 `leading: true` 时，挂载后的第一次变化会立即应用。如果 `leading` 和 `trailing` 都为 `false`，返回值永远不会更新。

该值通过引用进行比较。如果每次渲染都传入新的对象或数组，返回值会每 `wait` 毫秒更新一次；请先稳定引用，例如使用 `usePreservedReference`。

## 接口

```ts
function useDebouncedValue<T>(
  value: T,
  wait: number,
  options?: DebounceOptions,
): T;
```

### 参数

<Interface
  required
  name="value"
  type="T"
  description="要被防抖的值。"
/>

<Interface
  required
  name="wait"
  type="number"
  description="在最后一次变化后、更新之前等待的毫秒数。"
/>

<Interface
  name="options"
  type="DebounceOptions"
  description="用于防抖行为的配置选项。"
  :nested="[
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        '如果为 <code>true</code>，空闲期后的第一次变化会被立即应用。',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '如果为 <code>true</code>，最后一次变化会在 <code>wait</code> 毫秒后应用。',
    },
  ]"
/>

### 返回值

<Interface name="" type="T" description="防抖后的值。" />

## 示例

```tsx
import { useDebouncedValue } from "react-simplikit";
import { useState } from "react";

function SearchInput() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  return (
    <>
      <label>
        Search
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <output aria-live="polite">{debouncedQuery}</output>
    </>
  );
}
```
