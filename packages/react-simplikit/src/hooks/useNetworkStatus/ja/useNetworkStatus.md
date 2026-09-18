# useNetworkStatus

`useNetworkStatus` は、Network Information API にアクセスできる React フックです。
接続の種類、品質、速度、ユーザーのデータ節約設定など、ネットワーク接続の情報をそのまま提供します。
API に対応していない場合（Safari、Firefox など）、すべてのプロパティは `undefined` になります。

## インターフェース

```ts
function useNetworkStatus(): NetworkStatus;
```

### パラメータ

この関数はパラメータを受け取りません。

### 戻り値

<Interface
  name=""
  type="NetworkStatus"
  description="ネットワークの状態に関する情報です。"
  :nested="[
    {
      name: 'effectiveType',
      type: '\'slow-2g\' | \'2g\' | \'3g\' | \'4g\' | undefined',
      required: false,
      description:
        '接続品質です。API に対応していない場合は <code>undefined</code> です。',
    },
    {
      name: 'type',
      type: '\'bluetooth\' | \'cellular\' | \'ethernet\' | \'mixed\' | \'none\' | \'other\' | \'unknown\' | \'wifi\' | \'wimax\' | undefined',
      required: false,
      description:
        '物理的な接続の種類です。API に対応していない場合は <code>undefined</code> です。',
    },
    {
      name: 'downlink',
      type: 'number | undefined',
      required: false,
      description:
        '下り通信速度（Mbps）です。API に対応していない場合は <code>undefined</code> です。',
    },
    {
      name: 'rtt',
      type: 'number | undefined',
      required: false,
      description:
        '往復時間（ミリ秒）です。API に対応していない場合は <code>undefined</code> です。',
    },
    {
      name: 'saveData',
      type: 'boolean | undefined',
      required: false,
      description:
        'ユーザーのデータ節約設定です。API に対応していない場合は <code>undefined</code> です。',
    },
  ]"
/>

## 使用例

### 状況に応じた画質の調整

```tsx
function AdaptiveImage() {
  const { effectiveType, saveData } = useNetworkStatus();

  // アプリの要件に応じて画質を決めます
  const useHighQuality = effectiveType === '4g' && !saveData;

  return (
    <img src={useHighQuality ? 'high-res.jpg' : 'low-res.jpg'} alt="Content" />
  );
}
```

### 条件に応じた動画の自動再生

```tsx
function VideoPlayer() {
  const { type, downlink } = useNetworkStatus();

  // カスタムロジック：十分な帯域幅のある wifi 接続でのみ自動再生します
  const shouldAutoplay = type === 'wifi' && (downlink ?? 0) > 5;

  return <video src="video.mp4" autoPlay={shouldAutoplay} />;
}
```

## 注意事項

### ブラウザーの対応状況

- **Chrome/Edge（Android）**：すべてのプロパティに対応しています。
- **Chrome/Edge（デスクトップ）**：一部のプロパティに対応しています（`effectiveType`、`downlink`、`rtt`、`saveData` は利用できますが、`type` は `undefined` の場合があります）。
- **Firefox**：対応していません（すべてのプロパティが `undefined` です）。
- **Safari**：対応していません（すべてのプロパティが `undefined` です）。

### SSR の安全性

このフックはサーバーサイドレンダリング中も安全に使用できます。サーバーでは空のオブジェクト `{}` を返し、ブラウザーでのみネットワークの変化を購読します。

### 推奨事項

- すべてのブラウザーで API を利用できるわけではないため、値を使用する前に必ず `undefined` かどうかを確認してください。
- Network Information API に対応していないブラウザー向けにフォールバックを用意してください。
- このフックは必須機能ではなく、ユーザー体験を向上させるために使用してください。
- 配信する内容を決めるときは、`effectiveType` と `saveData` を併せて考慮してください。

### 参考資料

- [Network Information API の仕様](https://wicg.github.io/netinfo/)
- [MDN のドキュメント](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)
