# useThrottledCallback

`useThrottledCallback` は、渡されたコールバック関数をスロットリングして返す React フックです。
スロットリングされたコールバックは、指定した間隔につき最大 1 回だけ呼び出されます。
スロットリングされた関数は `callback` と同じ引数を受け取り、遅延時間の経過後に実行する呼び出しには最新の呼び出しの引数を渡します。

コンポーネントのアンマウント時、または `throttleMs`、`leading`、`trailing` の変更時には、実行待ちの呼び出しをキャンセルします。
`.cancel()` は実行待ちの呼び出しだけをキャンセルし、`callback` がすでに開始した処理は止めません。
`.cancel()` の後の次の呼び出しは新しい間隔を始めるため、`leading` が `true` の場合はすぐに実行されます。

## インターフェース

```ts
function useThrottledCallback<F extends (...args: any[]) => unknown>(
  options: Object
): ((...args: Parameters<F>) => void) & { cancel: () => void };
```

### パラメータ

<Interface
  required
  name="options"
  type="Object"
  description="オプションのオブジェクト。"
  :nested="[
    {
      name: 'options.callback',
      type: 'F',
      required: true,
      description: 'スロットリングする関数です。',
    },
    {
      name: 'options.throttleMs',
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
        '<code>true</code> の場合、遅延時間の経過後に、待機中の呼び出しを最新の引数で実行できます。',
    },
  ]"
/>

### 戻り値

<Interface
  name=""
  type="((...args: Parameters<F>) => void) & { cancel: () => void }"
  description="<code>callback</code> と同じ引数を受け取る、スロットリングされた関数です。実行待ちのスロットリング処理をキャンセルする <code>cancel</code> メソッドも含みます。"
/>

## 使用例

```tsx
import { useThrottledCallback } from 'react-simplikit';
import { useState } from 'react';

function ScrollPosition() {
  const [scrollTop, setScrollTop] = useState(0);
  const setScrollTopThrottled = useThrottledCallback({
    callback: setScrollTop,
    throttleMs: 200,
  });

  return (
    <div onScroll={e => setScrollTopThrottled(e.currentTarget.scrollTop)}>
      <p>Scrolled {scrollTop}px</p>
    </div>
  );
}
```
