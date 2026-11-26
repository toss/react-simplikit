# useDebouncedCallback

`useDebouncedCallback` 是一个返回所提供回调函数防抖版本的 React Hook。它通过延迟函数执行并将多次调用合并为一次，帮助优化事件处理。防抖函数接收与 `callback` 相同的参数，并原样转发最后一次调用的参数。

请注意，如果同时设置了 `leading` 和 `trailing`，函数会在延迟期的开始和结束都被调用。不过，要发生这种情况，必须在 debounceMs 时间间隔内至少调用两次，因为一次防抖函数调用无法两次触发该函数。

当组件卸载，或 `debounceMs`、`leading`、`trailing` 发生变化时，待执行的调用会被取消。调用 `.cancel()` 只会取消待执行的调用，不会停止 `callback` 已经开始的工作。`.cancel()` 之后的下一次调用会作为新的一组调用开始，因此当 `leading` 为 `true` 时会立即执行。

## 接口

```ts
function useDebouncedCallback<F extends (...args: any[]) => unknown>(
  options: Object
): ((...args: Parameters<F>) => void) & { cancel: () => void };
```

### 参数

<Interface
  required
  name="options"
  type="Object"
  description="选项对象。"
  :nested="[
    {
      name: 'options.callback',
      type: 'F',
      required: true,
      description: '要被防抖的函数。',
    },
    {
      name: 'options.debounceMs',
      type: 'number',
      required: true,
      description:
        '延迟函数执行的毫秒数。',
    },
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
  type="((...args: Parameters<F>) => void) & { cancel: () => void }"
  description="一个接收与 <code>callback</code> 相同参数的防抖函数。它还包含一个用于取消待执行防抖调用的 <code>cancel</code> 方法。"
/>

## 示例

```tsx
import { useDebouncedCallback } from 'react-simplikit';
import { useState } from 'react';

function SearchInput() {
  const [query, setQuery] = useState('');
  const setQueryDebounced = useDebouncedCallback({
    callback: setQuery,
    debounceMs: 300,
  });

  return (
    <>
      <input onChange={e => setQueryDebounced(e.target.value)} />
      <button type="button" onClick={() => setQueryDebounced.cancel()}>
        Cancel pending update
      </button>
      <p>Searching for: {query}</p>
    </>
  );
}
```
