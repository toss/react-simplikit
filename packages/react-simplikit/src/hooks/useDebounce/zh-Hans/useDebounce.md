# useDebounce

`useDebounce` 是一个返回所提供回调函数防抖版本的 React Hook。它通过延迟函数执行并将多次调用合并为一次，帮助优化事件处理。

使用默认选项时，最后一次调用会在没有再次调用的 `wait` 毫秒后执行。当组件卸载，或 `wait`、`leading`、`trailing` 发生变化时，待执行的调用会被取消。调用 `.cancel()` 只会取消一个待执行的回调，而不会取消一个已经开始的网络请求。该示例在本地显示查询。要搜索服务器，请将应用程序的搜索回调作为第一个参数传给 `useDebounce`。

## 接口

```ts
function useDebounce<F extends (...args: any[]) => unknown>(
  callback: F,
  wait: number,
  options?: DebounceOptions
): F & { cancel: () => void };
```

### 参数

<Interface
  required
  name="callback"
  type="F"
  description="要被防抖的函数。"
/>

<Interface
  required
  name="wait"
  type="number"
  description="延迟函数执行的毫秒数。"
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
  type="F & { cancel: () => void }"
  description="一个延迟调用原始回调的防抖函数。它还包含一个用于取消任何待执行防抖调用的 <code>cancel</code> 方法。"
/>

## 示例

```tsx
import { useState } from 'react';
import { useDebounce } from 'react-simplikit';

export function SearchInput() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const debouncedSearch = useDebounce(setSubmittedQuery, 300);

  return (
    <section>
      <label>
        Search
        <input
          value={query}
          onChange={event => {
            setQuery(event.target.value);
            debouncedSearch(event.target.value);
          }}
        />
      </label>
      <output aria-live="polite">{submittedQuery}</output>
      <button type="button" onClick={() => debouncedSearch.cancel()}>
        Cancel pending update
      </button>
    </section>
  );
}
```
