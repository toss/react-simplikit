# isAndroid

`isAndroid` は、現在のデバイスで Android が動作しているかどうかを判定するユーティリティ関数です。

User-Agent Client Hints API（`navigator.userAgentData.platform`）を優先し、利用できない場合は Client Hints の brands または `navigator.userAgent` で `"Android"` を照合します。

補足：

- すべての Android ブラウザーのユーザーエージェントには、トークン「Android」が含まれます。
- Android 上の Chromium は、通常 Client Hints の `platform` を `"Android"` として公開します。

## インターフェース

```ts
function isAndroid(userAgent?: string): boolean;
```

### パラメータ

<Interface
  name="userAgent"
  type="string"
  description="判定に使う任意のユーザーエージェント文字列。省略時は <code>navigator.userAgent</code> を使います。"
/>

### 戻り値

<Interface
  name=""
  type="boolean"
  description="デバイスが Android で動作している場合は <code>true</code>、そうでなければ <code>false</code> を返します。サーバーサイドレンダリング環境では <code>false</code> を返します。"
/>

## 例

```tsx
if (isAndroid()) {
  // Android 固有の処理
  enableAndroidOptimizations();
}
```

```tsx
// ユーザーエージェントを直接渡す場合
const isAndroidDevice = isAndroid(
  'Mozilla/5.0 (Linux; Android 12; Pixel 6) Chrome/120'
);
```
