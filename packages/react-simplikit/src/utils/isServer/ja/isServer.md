# isServer

`isServer` は、コードがサーバー上で実行されているかどうかを確認するユーティリティ関数です。
`window` が未定義の SSR（サーバーサイドレンダリング）環境では `true` を返し、
クライアント側の環境では `false` を返します。

## インターフェース

```ts
function isServer(): boolean;
```

### パラメータ

この関数はパラメータを受け取りません。

### 戻り値

<Interface
  name=""
  type="boolean"
  description="サーバー環境（SSR）で実行されている場合は <code>true</code>、それ以外の場合は <code>false</code>。"
/>

## 使用例

```tsx
if (isServer()) {
  // SSR で安全に実行できるコード
  return null;
}

// クライアント側でのみ実行するコード
window.addEventListener('resize', handleResize);
```
