# useThrottledState

`useThrottledState` は、状態を管理し、スロットリングされた setter を返す React フックです。
デフォルトのオプションでは、最初の setter 呼び出しをすぐに反映し、それ以降の呼び出しには
`throttleMs` に基づくスロットリングを適用します。保留中の最後の値は trailing のタイミングで反映します。
スクロールなど、頻繁に発生するイベントによる状態の更新頻度を制限する場合に便利です。

初回レンダリング時とサーバー上では、初期値をそのまま返します。マウント時には更新を予約しないため、
`leading: true` の場合、マウント後の最初の setter 呼び出しがすぐに反映されます。
`leading` と `trailing` が両方とも `false` の場合、状態は更新されません。

コンポーネントがアンマウントされるか、`throttleMs`、`leading`、`trailing` が変更されると、
保留中の更新はキャンセルされます。

## インターフェース

```ts
function useThrottledState<T>(
  initialValue: T,
  throttleMs: number,
  options?: ThrottleOptions
): [state: T, setState: (nextValue: T) => void];
```

### パラメータ

<Interface
  required
  name="initialValue"
  type="T"
  description="初回レンダリングでのみ使用する状態の初期値。"
/>

<Interface
  required
  name="throttleMs"
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
        '<code>true</code> の場合、スロットリングの区間の開始時に即座に更新できます。',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '<code>true</code> の場合、遅延時間の経過後に最新の値で保留中の更新を実行できます。',
    },
  ]"
/>

### 戻り値

<Interface
  name=""
  type="[state: T, setState: (nextValue: T) => void]"
  description="次の要素を含むタプル。"
  :nested="[
    {
      name: 'state',
      type: 'T',
      required: false,
      description: '現在の状態の値。',
    },
    {
      name: 'setState',
      type: '(nextValue: T) => void',
      required: false,
      description: '次の状態の値を受け取る、スロットリングされた setter。',
    },
  ]"
/>

## 使用例

```tsx
import { useThrottledState } from 'react-simplikit';

function ScrollPosition() {
  const [scrollTop, setScrollTop] = useThrottledState(0, 200);

  return (
    <div onScroll={e => setScrollTop(e.currentTarget.scrollTop)}>
      <p>Scrolled {scrollTop}px</p>
    </div>
  );
}
```
