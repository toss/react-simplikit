# isAndroid

`isAndroid` は、現在のデバイスで Android が動作しているかどうかを判定するユーティリティ関数です。

補足：

- すべての Android ブラウザーのユーザーエージェントには、トークン「Android」が含まれます。

## インターフェース

```ts
function isAndroid(userAgent?: string): boolean;
```

### パラメータ

<Interface
  name="userAgent"
  type="string"
  description="判定対象のユーザーエージェント文字列（省略可能）。デフォルトは <code>navigator.userAgent</code> です。"
/>

### 戻り値

<Interface
  name=""
  type="boolean"
  description="デバイスで Android が動作している場合は <code>true</code>、それ以外の場合は <code>false</code>。サーバーサイドレンダリング環境では <code>false</code> を返します。"
/>

## 使用例

```tsx
if (isAndroid()) {
  // Android 固有のコード
  enableAndroidOptimizations();
}
```

```tsx
// カスタムのユーザーエージェントを指定する場合
const isAndroidDevice = isAndroid(
  'Mozilla/5.0 (Linux; Android 12; Pixel 6) Chrome/120'
);
```
