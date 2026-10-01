# useThrottledCallback

`useThrottledCallback` は、渡されたコールバック関数をスロットリングして返す React フックです。
スロットリングされたコールバックは、指定した間隔につき最大 1 回だけ呼び出されます。

## インターフェース

```ts
function useThrottledCallback<T>(
  onChange: (newValue: T) => void,
  throttleMs: number,
  options?: ThrottleOptions
): (nextValue: T) => void;
```

### パラメータ

<Interface
  required
  name="onChange"
  type="(newValue: T) => void"
  description="値を受け取るコールバックです。"
/>

<Interface
  required
  name="throttleMs"
  type="number"
  description="スロットルの間隔をミリ秒で指定します。"
/>

<Interface
  name="options"
  type="ThrottleOptions"
  description="追加の動作を設定するオプションです。"
  :nested="[
    {
      name: 'options.edges',
      type: 'Array<\'leading\' | \'trailing\'>',
      required: false,
      defaultValue: '[\'leading\', \'trailing\']',
      description:
        '関数を区間の開始時、終了時、またはその両方で呼び出すかを指定する省略可能な配列。',
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
  const setScrollTopThrottled = useThrottledCallback(setScrollTop, 200);

  return (
    <div onScroll={e => setScrollTopThrottled(e.currentTarget.scrollTop)}>
      <p>Scrolled {scrollTop}px</p>
    </div>
  );
}
```
