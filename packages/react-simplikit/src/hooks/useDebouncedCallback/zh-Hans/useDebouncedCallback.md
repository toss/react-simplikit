# useDebouncedCallback

`useDebouncedCallback` 是一个返回所提供回调函数防抖版本的 React Hook。它通过延迟函数执行并将多次调用合并为一次，帮助优化事件处理。

请注意，如果同时设置了 `leading` 和 `trailing`，函数会在延迟期的开始和结束都被调用。不过，要发生这种情况，必须在 debounceMs 时间间隔内至少调用两次，因为一次防抖函数调用无法两次触发该函数。

## 接口

```ts
function useDebouncedCallback<T>(
  onChange: (newValue: T) => void,
  debounceMs: number,
  options?: DebounceOptions
): (nextValue: T) => void;
```

### 参数

<Interface
  required
  name="onChange"
  type="(newValue: T) => void"
  description="接收值的回调函数。"
/>

<Interface
  required
  name="debounceMs"
  type="number"
  description="防抖延迟，单位为毫秒。"
/>

<Interface
  name="options"
  type="DebounceOptions"
  description="配置其他行为的选项。"
  :nested="[
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        '如果为 <code>true</code>，函数会在序列开始时被调用。',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '如果为 <code>true</code>，函数会在序列结束时被调用。',
    },
  ]"
/>

### 返回值

<Interface
  name=""
  type="(nextValue: T) => void"
  description="一个将值转发给 <code>onChange</code> 的防抖函数。"
/>

## 示例

```tsx
import { useDebouncedCallback } from 'react-simplikit';
import { useState } from 'react';

function SearchInput() {
  const [query, setQuery] = useState('');
  const setQueryDebounced = useDebouncedCallback(setQuery, 300);

  return (
    <>
      <input onChange={e => setQueryDebounced(e.target.value)} />
      <p>Searching for: {query}</p>
    </>
  );
}
```
