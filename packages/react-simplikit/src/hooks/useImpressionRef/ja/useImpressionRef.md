# useImpressionRef

`useImpressionRef` は、特定の DOM 要素が画面に表示されている時間を計測し、要素がビューポートに入ったときや出たときにコールバックを実行する React フックです。
`IntersectionObserver` と `Visibility API` を使って、要素の表示状態を追跡します。

## インターフェース

```ts
function useImpressionRef<Element extends HTMLElement>(
  options: UseImpressionRefOptions
): (element: Element | null) => void;
```

### パラメータ

<Interface
  required
  name="options"
  type="UseImpressionRefOptions"
  description="要素の表示状態を追跡するためのオプション。"
  :nested="[
    {
      name: 'options.onImpressionStart',
      type: '() => void',
      required: false,
      description:
        '要素が表示領域に入ったときに実行するコールバック関数。',
    },
    {
      name: 'options.onImpressionEnd',
      type: '() => void',
      required: false,
      description: '要素が表示領域から出たときに実行するコールバック関数。',
    },
    {
      name: 'options.timeThreshold',
      type: 'number',
      required: false,
      defaultValue: '0',
      description: '要素が表示されている必要がある最小時間（ミリ秒単位）。',
    },
    {
      name: 'options.areaThreshold',
      type: 'number',
      required: false,
      defaultValue: '0',
      description: '表示されている必要がある要素の最小割合（0 から 1）。',
    },
    {
      name: 'options.rootMargin',
      type: 'string',
      required: true,
      description: '検出領域を調整するためのマージン。',
    },
  ]"
/>

### 戻り値

<Interface
  name=""
  type="(element: Element | null) => void"
  description="対象の要素を設定する関数です。この関数を <code>ref</code> 属性に設定すると、要素の表示状態が変わるたびにコールバックを実行します。"
/>

## 使用例

```tsx
import { useImpressionRef } from 'react-simplikit';

function Component() {
  const ref = useImpressionRef<HTMLDivElement>({
    onImpressionStart: () => console.log('Element entered view'),
    onImpressionEnd: () => console.log('Element exited view'),
    timeThreshold: 1000,
    areaThreshold: 0.5,
  });

  return <div ref={ref}>Track my visibility!</div>;
}
```
