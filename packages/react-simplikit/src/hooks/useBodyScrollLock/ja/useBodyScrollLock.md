# useBodyScrollLock

`useBodyScrollLock` は、コンポーネントがマウントされている間、body のスクロールをロックする React フックです。
マウント時に自動でロックし、アンマウント時に解除します。
モーダルやドロワーなど、背後のページのスクロールを防ぐ必要があるオーバーレイコンポーネントに便利です。

## インターフェース

```ts
function useBodyScrollLock(): void;
```

### パラメータ

この関数はパラメータを受け取りません。

### 戻り値

この関数は値を返しません。

## 使用例

### 基本的な使い方

```tsx
function Modal() {
  useBodyScrollLock();
  return <div className="modal">Modal content</div>;
}
```

### 複数のモーダルで一度だけロックするパターン

```tsx
// 重なり合う各モーダルではなく、親で一度だけロックします
function BodyScrollLock() {
  useBodyScrollLock();
  return null;
}

function App() {
  const hasModal = showModal1 || showModal2;

  return (
    <>
      {hasModal && <BodyScrollLock />}
      {showModal1 && <Modal1 />}
      {showModal2 && <Modal2 />}
    </>
  );
}
```

## 注意点

- **SSR の安全性**：ロックはクライアントでのみ実行される `useEffect` 内で適用されるため、サーバーサイドレンダリングでも安全に使えます。
- **自動クリーンアップ**：コンポーネントのアンマウント時にロックを解除します。
- **複数のモーダル**：複数のモーダルが重なる場合は、競合を避けて一貫した動作を保つために、各モーダルではなく親で一度だけロックします。
- **ロックの仕組み**：`enableBodyScrollLock` は `body` をその場に固定し（`position: fixed` と `overflow: hidden`）、スクロール位置を data 属性に保存します。`disableBodyScrollLock` はこれらのスタイルを削除し、スクロール位置を復元します。
