# ImpressionArea

`ImpressionArea` は、特定の DOM 要素が画面に表示されている時間を計測し、
要素がビューポートに入ったときや出たときにコールバックを実行するコンポーネントです。
`useImpressionRef` フックを使用して、要素の表示状態を追跡します。

## インターフェース

```ts
function ImpressionArea<T extends ElementType>(
  as: T = 'div',
  rootMargin?: string,
  areaThreshold?: number,
  timeThreshold?: number,
  onImpressionStart?: () => void,
  onImpressionEnd?: () => void,
  ref?: Ref<Element<T>>,
  children?: React.ReactNode,
  className?: string
): JSX.Element;
```

### パラメータ

<Interface
  name="as"
  type="T"
  description="レンダリングする HTML タグ。デフォルトは <code>div</code> です。"
/>

<Interface
  name="rootMargin"
  type="string"
  description="検出領域を調整するマージン。"
/>

<Interface
  name="areaThreshold"
  type="number"
  description="要素が表示されている必要がある最小の割合（0〜1）。"
/>

<Interface
  name="timeThreshold"
  type="number"
  description="要素が表示されている必要がある最小の時間（ミリ秒）。"
/>

<Interface
  name="onImpressionStart"
  type="() => void"
  description="要素が表示領域に入ったときに実行されるコールバック関数。"
/>

<Interface
  name="onImpressionEnd"
  type="() => void"
  description="要素が表示領域から出たときに実行されるコールバック関数。"
/>

<Interface
  name="ref"
  type="Ref<Element<T>>"
  description="要素への参照。"
/>

<Interface
  name="children"
  type="React.ReactNode"
  description="コンポーネント内にレンダリングする子要素。"
/>

<Interface
  name="className"
  type="string"
  description="スタイルを適用するための追加のクラス名。"
/>

### 戻り値

<Interface
  name=""
  type="JSX.Element"
  description="子要素の表示状態を追跡する React コンポーネント。"
/>

## 使用例

```tsx
function App() {
  return (
    <ImpressionArea
      onImpressionStart={() => console.log('要素が表示領域に入りました')}
      onImpressionEnd={() => console.log('要素が表示領域から出ました')}
      timeThreshold={1000}
      areaThreshold={0.5}
    >
      <div>この要素を追跡してください！</div>
    </ImpressionArea>
  );
}
```
