# useIsomorphicLayoutEffect

`useIsomorphicLayoutEffect` は、サーバーサイドレンダリング中に警告を発生させずに、ブラウザーで `useLayoutEffect` を実行する React フックです。
SSR 中には同期的に計測や変更ができる DOM が存在しないため、React は `useLayoutEffect` の使用に対して警告を表示します。

React はサーバーでエフェクトを実行しないため、エフェクトはブラウザーでのみ実行されます。サーバーでは、このフックは React が実行しない `useEffect` になります。
このフックは警告を避けるためだけに存在します。サーバーで何かを実行することはなく、サーバーの出力をクライアントと一致させることもありません。

ブラウザーでは DOM の更新後、ブラウザーが画面を描画する前に同期的に実行されるため、次の用途に適しています。

- レンダリング後の DOM 要素の計測
- 画面の描画前に DOM の変更を適用
- UI のちらつきやレイアウトのずれの防止

## インターフェース

```ts
function useIsomorphicLayoutEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList
): void;
```

### パラメータ

<Interface
  required
  name="effect"
  type="React.EffectCallback"
  description="エフェクト関数です。"
/>

<Interface
  name="deps"
  type="React.DependencyList"
  description="依存関係を指定する配列です。省略できます。"
/>

### 戻り値

この関数は値を返しません。

## 使用例

```tsx
useIsomorphicLayoutEffect(() => {
  // クライアント側のレイアウトフェーズで実行するコード
}, [dep1, dep2, ...]);
```
