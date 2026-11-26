# useDebouncedState

`useDebouncedState` 是一个管理状态并返回防抖状态设置函数的 React Hook。使用默认选项时，状态会在最后一次调用状态设置函数的 `debounceMs` 毫秒后更新。它适用于搜索输入等场景，可以将一连串快速的更新请求合并为最后一个值进行更新。

首次渲染和服务端渲染时，初始值会原样返回。挂载时不会安排更新，因此设置 `leading: true` 后，挂载后的第一次状态设置函数调用会立即生效。如果 `leading` 和 `trailing` 均为 `false`，状态将不会更新。

组件卸载或 `debounceMs`、`leading`、`trailing` 发生变化时，待处理的更新会被取消。

## 接口

```ts
function useDebouncedState<T>(
  initialValue: T,
  debounceMs: number,
  options?: DebounceOptions
): [state: T, setState: Dispatch<SetStateAction<T>>];
```

### 参数

<Interface
  required
  name="initialValue"
  type="T"
  description="初始状态值，仅在首次渲染时使用。"
/>

<Interface
  required
  name="debounceMs"
  type="number"
  description="最后一次调用状态设置函数后，更新前需要等待的毫秒数。"
/>

<Interface
  name="options"
  type="DebounceOptions"
  description="防抖行为的配置选项。"
  :nested="[
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        '如果为 <code>true</code>，空闲期后第一次调用状态设置函数会立即生效。',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '如果为 <code>true</code>，最后一个值会在 <code>debounceMs</code> 毫秒后生效。',
    },
  ]"
/>

### 返回值

<Interface
  name=""
  type="[state: T, setState: Dispatch<SetStateAction<T>>]"
  description="包含以下元素的元组："
  :nested="[
    {
      name: 'state',
      type: 'T',
      required: false,
      description: '当前状态值。',
    },
    {
      name: 'setState',
      type: 'Dispatch<SetStateAction<T>>',
      required: false,
      description: '接收下一个状态值或更新函数的防抖状态设置函数。',
    },
  ]"
/>

## 示例

```tsx
import { useDebouncedState } from 'react-simplikit';

function SearchInput() {
  const [query, setQuery] = useDebouncedState('', 300);

  return (
    <>
      <label>
        Search
        <input onChange={event => setQuery(event.target.value)} />
      </label>
      <output aria-live="polite">{query}</output>
    </>
  );
}
```
