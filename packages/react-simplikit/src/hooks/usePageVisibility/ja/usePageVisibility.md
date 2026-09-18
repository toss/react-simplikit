# usePageVisibility

`usePageVisibility` は、ページの表示状態の変化を検出する React フックです。
Page Visibility API を使用して、ユーザーによるタブの切り替えやブラウザーの最小化を監視します。
アニメーション、動画、バックグラウンド処理を一時停止・再開し、パフォーマンスとユーザー体験を向上させる場合に役立ちます。

## インターフェース

```ts
function usePageVisibility(): PageVisibility;
```

### パラメータ

この関数はパラメータを受け取りません。

### 戻り値

<Interface
  name=""
  type="PageVisibility"
  description="ページの表示状態に関する情報です。"
  :nested="[
    {
      name: 'isVisible',
      type: 'boolean',
      required: false,
      description:
        'ページが現在ユーザーに表示されている場合は <code>true</code> です。',
    },
    {
      name: 'visibilityState',
      type: '\'visible\' | \'hidden\'',
      required: false,
      description: '現在の表示状態です。',
    },
  ]"
/>

## 使用例

### 動画プレーヤーの制御

```tsx
// ユーザーが別のタブに切り替えたときに動画を自動的に一時停止します
function VideoPlayer() {
  const { isVisible } = usePageVisibility();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // タブが非表示になったときに動画を一時停止します
    if (!isVisible) {
      videoRef.current.pause();
    }
  }, [isVisible]);

  return <video ref={videoRef} src="video.mp4" />;
}
```

### アナリティクスのトラッキング

```tsx
// ユーザーがページから離れたときや戻ったときを追跡します
function Analytics() {
  const { isVisible, visibilityState } = usePageVisibility();

  useEffect(() => {
    if (visibilityState === 'hidden') {
      // ユーザーがページから離れたときを追跡します
      analytics.track('page_hidden');
    }
  }, [visibilityState]);

  return null;
}
```

## 注意事項

- **SSR の安全性**：サーバーサイドレンダリング中は Page Visibility API を利用できないため、このフックは安全なデフォルト値 `{ isVisible: true, visibilityState: 'visible' }` を返します。
- **ブラウザーの対応状況**：Page Visibility API はすべてのモダンブラウザーで利用できます。詳しくは [MDN のブラウザー互換性一覧](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API#browser_compatibility)を参照してください。
- **パフォーマンス**：このフックはネイティブの `visibilitychange` イベントを監視するため、ポーリングを行わず、オーバーヘッドもごくわずかです。
- **表示状態**：`'visible'` と `'hidden'` のみを返します。非推奨の `'prerender'` 状態は含まれません。
