# disableBodyScrollLock

`disableBodyScrollLock` は、body のスクロールロックを解除するユーティリティ関数です。
`enableBodyScrollLock` によるスクロールロックを解除し、保存されたスクロール位置に戻します。

SSR 環境でも安全に呼び出せます（サーバーでは何も行いません）。
ロックされていない場合でも安全に呼び出せます（何も行いません）。

## インターフェース

```ts
function disableBodyScrollLock(): void;
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
