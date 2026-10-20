# isIOS

`isIOS` は、現在のデバイスで iOS または iPadOS が動作しているかどうかを判定するユーティリティ関数です。

User-Agent Client Hints API（`navigator.userAgentData.platform`）を優先し、利用できない場合はレガシーな `navigator.platform` / `navigator.userAgent` 文字列にフォールバックします。

プラットフォーム情報の違いに関する補足：

- iPadOS 13 より前の iPad は、プラットフォームを「iPad」として報告していました（または UA が /iPad/ に一致していました）。
- iPadOS 13 以降、Apple はプラットフォーム文字列を「MacIntel」に変更し、
  Web サイトが iPadOS をデスクトップ向けの Safari として扱うようにしました。
  ただし、これらのデバイスでは引き続きマルチタッチ機能を検出できます。
- Chromium 系ブラウザーは Client Hints の `platform` を `"iPhone"` ではなく `"iOS"` として報告する場合があります。

## インターフェース

```ts
function isIOS(userAgent?: string): boolean;
```

### パラメータ

<Interface
  name="userAgent"
  type="string"
  description="判定に使う任意のユーザーエージェント文字列。省略時は <code>navigator.userAgent</code> を使います。指定した場合はその文字列を直接照合し、最新の iPadOS 判定ではデスクトップ級の iPad Safari を検出するため、実行中のプラットフォームとタッチ API も引き続き使います。"
/>

### 戻り値

<Interface
  name=""
  type="boolean"
  description="デバイスが iOS または iPadOS で動作している場合は <code>true</code>、そうでなければ <code>false</code> を返します。サーバーサイドレンダリング環境では <code>false</code> を返します。"
/>

## 例

```tsx
if (isIOS()) {
  // iOS 固有の処理
  enableIOSOptimizations();
}
```

```tsx
// ユーザーエージェントを直接渡す場合
const isIOSDevice = isIOS(
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
);
```
