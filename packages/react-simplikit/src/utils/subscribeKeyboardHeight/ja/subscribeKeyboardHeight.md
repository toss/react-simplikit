# subscribeKeyboardHeight

`subscribeKeyboardHeight` は、画面上のキーボードの高さの変化を購読するユーティリティ関数です。

指定したコールバックは、キーボードの表示、非表示、サイズ変更など、
キーボードの高さが変わる可能性があるたびに呼び出されます。

内部では、Visual Viewport の `resize` イベントと `scroll` イベントの
両方を監視します。

- `resize`: ビジュアルビューポートの高さが変わったときに発生します
- `scroll`: ビジュアルビューポートのオフセットが変わったときに発生します
  （サイズが変わらずにビューポートが移動することがある iOS で重要です）

パフォーマンスの最適化：

- デフォルトでスロットリング（16ms、約 60fps）を行い、コールバックの過剰な呼び出しを防ぎます
- 高さが変わっていない場合はコールバックを呼び出しません（重複排除）

## インターフェース

```ts
function subscribeKeyboardHeight(
  options: SubscribeKeyboardHeightOptions
): SubscribeKeyboardHeightResult;
```

### パラメータ

<Interface
  required
  name="options"
  type="SubscribeKeyboardHeightOptions"
  description="設定オプション"
  :nested="[
    {
      name: 'options.callback',
      type: '(height: number) => void',
      required: true,
      description:
        '更新されたキーボードの高さをピクセル単位で受け取る関数。',
    },
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        'true の場合、現在のキーボードの高さを引数としてコールバックを即座に呼び出します。',
    },
    {
      name: 'options.throttleMs',
      type: 'number',
      required: false,
      defaultValue: '16',
      description: 'スロットリングの間隔（ミリ秒単位）。',
    },
  ]"
/>

### 戻り値

<Interface
  name=""
  type="SubscribeKeyboardHeightResult"
  description="購読を解除する関数を含むオブジェクト。"
  :nested="[
    {
      name: 'unsubscribe',
      type: '() => void',
      required: false,
      description:
        'すべてのリスナーの登録を解除し、キーボードの高さの更新の受信を停止します。',
    },
  ]"
/>

## 使用例

```tsx
const { unsubscribe } = subscribeKeyboardHeight({
  callback: height => {
    footer.style.paddingBottom = `${height}px`;
  },
  immediate: true,
});

// 後でクリーンアップが必要になったときに実行します
unsubscribe();
```
