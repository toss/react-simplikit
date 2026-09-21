# isIOS

`isIOS` は、現在のデバイスで iOS または iPadOS が動作しているかどうかを判定するユーティリティ関数です。

プラットフォーム情報の違いに関する補足：

- iPadOS 13 より前の iPad は、プラットフォームを「iPad」として報告していました（または UA が /iPad/ に一致していました）。
- iPadOS 13 以降、Apple はプラットフォーム文字列を「MacIntel」に変更し、
  Web サイトが iPadOS をデスクトップ向けの Safari として扱うようにしました。
  ただし、これらのデバイスでは引き続きマルチタッチ機能を検出できます。

## インターフェース

```ts
function isIOS(userAgent?: string): boolean;
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
  description="デバイスで iOS または iPadOS が動作している場合は <code>true</code>、それ以外の場合は <code>false</code>。サーバーサイドレンダリング環境では <code>false</code> を返します。"
/>

## 使用例

```tsx
if (isIOS()) {
  // iOS 固有のコード
  enableIOSOptimizations();
}
```

```tsx
// カスタムのユーザーエージェントを指定する場合
const isIOSDevice = isIOS(
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
);
```
