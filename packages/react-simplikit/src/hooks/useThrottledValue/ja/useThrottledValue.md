# useThrottledValue

`useThrottledValue` は、渡された値をスロットリングして返す React フックです。
状態は引き続き呼び出し元が管理し、戻り値は `wait` ミリ秒につき最大 1 回、その状態に追従します。
スクロール位置、ポインターの位置、リサイズ時の要素サイズに応じて、負荷の高いレンダリングを行う場合に便利です。

初回レンダリング時とサーバー上では、値をそのまま返します。マウント時には変更を予約しないため、
`leading` が `true` の場合、マウント後の最初の変更はすぐに反映されます。
`leading` と `trailing` が両方とも `false` の場合、戻り値は更新されません。

値は参照で比較します。レンダリングのたびに新しいオブジェクトや配列を渡すと、
戻り値が `wait` ミリ秒ごとに更新され続けます。まず `usePreservedReference` などを使って参照を安定させてください。

## インターフェース

```ts
function useThrottledValue<T>(
  value: T,
  wait: number,
  options?: ThrottleOptions
): T;
```

### パラメータ

<Interface
  required
  name="value"
  type="T"
  description="スロットリングする値。"
/>

<Interface
  required
  name="wait"
  type="number"
  description="スロットリングの区間の長さ（ミリ秒単位）。"
/>

<Interface
  name="options"
  type="ThrottleOptions"
  description="スロットリングの動作を設定するオプション。"
  :nested="[
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '<code>true</code> の場合、区間内の最初の変更をすぐに反映します。',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '<code>true</code> の場合、区間内の最後の変更を、その変更から <code>wait</code> ミリ秒後に反映します。',
    },
  ]"
/>

### 戻り値

<Interface name="" type="T" description="スロットリングされた値。" />

## 使用例

```tsx
import { useThrottledValue } from 'react-simplikit';
import { useState } from 'react';

function ScrollProgress() {
  const [scrollY, setScrollY] = useState(0);
  const throttledScrollY = useThrottledValue(scrollY, 100);

  return (
    <div onScroll={e => setScrollY(e.currentTarget.scrollTop)}>
      <ProgressBar position={throttledScrollY} />
    </div>
  );
}
```
