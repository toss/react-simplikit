# useScrollDirection

`useScrollDirection` は、スクロール方向を検出する React フックです。
スクロール方向（上／下）と現在のスクロール位置を返します。
パフォーマンスのため、デフォルトでは 50ms 間隔でスロットリングします。

## インターフェース

```ts
function useScrollDirection(
  options?: UseScrollDirectionOptions
): ScrollDirectionState;
```

### パラメータ

<Interface
  name="options"
  type="UseScrollDirectionOptions"
  description="設定オプション。"
  :nested="[
    {
      name: 'options.throttleMs',
      type: 'number',
      required: false,
      defaultValue: '50',
      description: 'スロットリングの間隔（ミリ秒単位）。',
    },
  ]"
/>

### 戻り値

<Interface
  name=""
  type="ScrollDirectionState"
  description="スクロール方向と位置を含むオブジェクト。"
  :nested="[
    {
      name: 'direction',
      type: '\'up\' | \'down\' | null',
      required: false,
      description:
        '現在のスクロール方向。初回レンダリング時は <code>null</code> です。',
    },
    {
      name: 'position',
      type: 'number',
      required: false,
      description: '現在の垂直スクロール位置（ピクセル単位）。',
    },
  ]"
/>

## 使用例

```tsx
function Header() {
  const { direction, position } = useScrollDirection();

  // 下方向にスクロールしたときにヘッダーを非表示にします
  const isHidden = direction === 'down' && position > 100;

  return <header className={isHidden ? 'hidden' : 'visible'}>My Header</header>;
}
```

### スロットリングの間隔をカスタマイズする

```tsx
function MyComponent() {
  // デフォルトの 50ms ではなく 100ms ごとに更新します
  const { direction, position } = useScrollDirection({ throttleMs: 100 });

  return (
    <div>
      Scrolling {direction}! Position: {position}px
    </div>
  );
}
```

## 注意点

- **SSR の安全性**：`window.scrollY` を読み取る前に `isServer()` を確認するため、サーバーサイドレンダリングでも安全に使えます。
- **パフォーマンス**：スクロールイベントをスロットリングし、処理頻度を制限します（デフォルト：50ms）。
- **パッシブリスナー**：スクロールをより滑らかにするため、スクロールリスナーを `{ passive: true }` で登録します。
- **クリーンアップ**：コンポーネントのアンマウント時に、イベントリスナーとスロットリング用のタイマーを削除します。
- **ブラウザーの対応**：`window` と `scrollY` を備えたブラウザー環境が必要です。
