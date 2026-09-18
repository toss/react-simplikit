# useIsClient

`useIsClient` は、クライアント側の環境でのみ `true` を返す React フックです。
主にクライアント側のレンダリングとサーバーサイドレンダリング（SSR）を区別するために使用します。
状態が `true` になるのは、クライアント側の環境でコンポーネントがマウントされた後だけです。

## インターフェース

```ts
function useIsClient(): boolean;
```

### パラメータ

この関数はパラメータを受け取りません。

### 戻り値

<Interface
  name=""
  type="boolean"
  description="クライアント側の環境では <code>true</code> を、それ以外では <code>false</code> を返します。"
/>

## 使用例

```tsx
function ClientSideContent() {
  const isClient = useIsClient();

  if (!isClient) {
    return <div>Loading...</div>; // サーバー側でレンダリングされます
  }

  return <div>Client-side rendered content</div>; // クライアント側でレンダリングされます
}
```

```tsx
function ClientOnlyMap() {
  const isClient = useIsClient();

  if (!isClient) return null;

  return <div id="map" />;
}
```

```tsx
function ClientTheme() {
  const isClient = useIsClient();

  const theme = isClient ? localStorage.getItem('theme') : 'light';

  return <div>Current theme: {theme}</div>;
}
```
