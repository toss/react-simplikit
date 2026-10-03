# useThrottledCallback

`useThrottledCallback` は、渡されたコールバック関数をスロットリングして返す React フックです。
スロットリングされたコールバックは、指定した間隔につき最大 1 回だけ呼び出されます。

## インターフェース

```ts
function useThrottledCallback<T>(options: Object): (nextValue: T) => void;
```

### パラメータ

<Interface
  required
  name="options"
  type="Object"
  description="オプションのオブジェクト。"
  :nested="[
    {
      name: 'options.onChange',
      type: '(newValue: T) => void',
      required: true,
      description:
        'スロットリングするコールバック。最後に渡された値と同じ値での呼び出しはスキップされます。',
    },
    {
      name: 'options.timeThreshold',
      type: 'number',
      required: true,
      description: '呼び出しを制限する間隔（ミリ秒単位）。',
    },
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '<code>true</code> の場合、スロットリング区間の開始時に即座に呼び出せます。',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '<code>true</code> の場合、遅延時間の経過後に、待機中の呼び出しを最新の値で実行できます。',
    },
  ]"
/>

### 戻り値

<Interface
  name=""
  type="(nextValue: T) => void"
  description="指定した間隔につき最大 1 回、値を <code>onChange</code> に渡す、スロットリングされた関数。"
/>

## 使用例

```tsx
import { useThrottledCallback } from 'react-simplikit';
import { useState } from 'react';

function ScrollPosition() {
  const [scrollTop, setScrollTop] = useState(0);
  const setScrollTopThrottled = useThrottledCallback({
    onChange: setScrollTop,
    timeThreshold: 200,
  });

  return (
    <div onScroll={e => setScrollTopThrottled(e.currentTarget.scrollTop)}>
      <p>Scrolled {scrollTop}px</p>
    </div>
  );
}
```
