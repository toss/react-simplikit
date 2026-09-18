# Separated

`Separated` は、各子要素の間に指定したコンポーネントを挿入するコンポーネントです。
リスト内に区切り線や余白など、繰り返し表示する要素を追加するときに便利です。

## インターフェース

```ts
function Separated(children: React.ReactNode, by: React.ReactNode): JSX.Element;
```

### パラメータ

<Interface
  required
  name="children"
  type="React.ReactNode"
  description="レンダリングする子要素。有効な React 要素（<code>React.isValidElement</code>）のみがレンダリングされます。"
/>

<Interface
  required
  name="by"
  type="React.ReactNode"
  description="子要素の間に挿入するコンポーネント。"
/>

### 戻り値

<Interface
  name=""
  type="JSX.Element"
  description="指定した区切り要素で子要素を区切る React コンポーネント。"
/>

## 使用例

```tsx
function App() {
  return (
    <Separated by={<Border type="padding24" />}>
      {['hello', 'react', 'world'].map(item => (
        <div key={item}>{item}</div>
      ))}
    </Separated>
  );
  // 期待される出力:
  // <div>hello</div>
  // <Border type="padding24" />
  // <div>react</div>
  // <Border type="padding24" />
  // <div>world</div>
}
```
