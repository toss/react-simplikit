# useAvoidKeyboard

`useAvoidKeyboard` は、画面下部に固定された要素がソフトウェアキーボードと重ならないようにする React フックです。
`position: fixed` の要素に適用できる CSS スタイルを返し、
キーボードが表示されたときに要素をキーボードの上へ滑らかに移動させます。

## インターフェース

```ts
function useAvoidKeyboard(
  options?: UseAvoidKeyboardOptions
): UseAvoidKeyboardResult;
```

### パラメータ

<Interface
  name="options"
  type="UseAvoidKeyboardOptions"
  description="設定オプション。"
  :nested="[
    {
      name: 'options.safeAreaBottom',
      type: 'number',
      required: false,
      defaultValue: '0',
      description:
        'キーボードが非表示のときの、下端からの基本オフセット（ピクセル単位）です。iPhone のホームインジケーター領域を考慮する際に役立ちます。',
    },
    {
      name: 'options.transitionDuration',
      type: 'number',
      required: false,
      defaultValue: '200',
      description: '滑らかなアニメーションのためのトランジション時間（ミリ秒単位）。',
    },
    {
      name: 'options.transitionTimingFunction',
      type: 'CSSProperties[\'transitionTimingFunction\']',
      required: false,
      defaultValue: '\'ease-out\'',
      description: 'アニメーションのトランジションに使用するタイミング関数。',
    },
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description: 'true の場合、マウント時にキーボードの初期の高さを取得します。',
    },
  ]"
/>

### 戻り値

<Interface
  name=""
  type="UseAvoidKeyboardResult"
  description="キーボードとの重なりを避けるための CSS スタイルを含むオブジェクト。"
  :nested="[
    {
      name: 'style',
      type: 'CSSProperties',
      required: false,
      description:
        '画面下部に固定された要素に適用する CSS スタイルオブジェクトです。<code>transform</code> と <code>transition</code> プロパティを含みます。',
    },
  ]"
/>

## 使用例

```tsx
function FixedBottomCTA() {
  const { style } = useAvoidKeyboard();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        ...style,
      }}
    >
      <button>Submit</button>
    </div>
  );
}
```

```tsx
// セーフエリアの下端オフセットを指定する場合（例：iPhone のホームインジケーター）
function FixedBottomCTA() {
  const { style } = useAvoidKeyboard({ safeAreaBottom: 34 });

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        ...style,
      }}
    >
      <button>Submit</button>
    </div>
  );
}
```
