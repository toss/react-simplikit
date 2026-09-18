# enableBodyScrollLock

`enableBodyScrollLock` は、body のスクロールをロックするユーティリティ関数です。
固定配置を適用して body のスクロールを防ぎます。
モーダルやドロワーなどのオーバーレイコンポーネントを開く際に便利です。

SSR 環境でも安全に呼び出せます（サーバーでは何も行いません）。
ロックを解除するまで、繰り返し呼び出しても効果はありません。

## インターフェース

```ts
function enableBodyScrollLock(): void;
```

### パラメータ

この関数はパラメータを受け取りません。

### 戻り値

この関数は何も返しません。

## 使用例

```tsx
// モーダルが開いたとき
enableBodyScrollLock();

// モーダルが閉じたとき
disableBodyScrollLock();
```
