# useLongPress

`useLongPress` は、要素が指定した時間押し続けられたことを検出する React フックです。
マウスイベントとタッチイベントの両方を処理するため、デスクトップ端末とモバイル端末で一貫した動作を実現できます。

## インターフェース

```ts
function useLongPress<E extends HTMLElement>(
  onLongPress: (event: React.MouseEvent<E> | React.TouchEvent<E>) => void,
  options?: UseLongPressOptions
): Object;
```

### パラメータ

<Interface
  required
  name="onLongPress"
  type="(event: React.MouseEvent<E> | React.TouchEvent<E>) => void"
  description="長押しが検出されたときに実行するコールバック関数です。"
/>

<Interface
  name="options"
  type="UseLongPressOptions"
  description="長押しの動作を設定するオプションです。"
  :nested="[
    {
      name: 'options.delay',
      type: 'number',
      required: false,
      defaultValue: '500',
      description:
        '長押しと判定されるまでの時間（ミリ秒）です。デフォルトは 500ms です。',
    },
    {
      name: 'options.moveThreshold',
      type: 'Object',
      required: false,
      description: '長押しがキャンセルされずに許容される最大移動量です。',
    },
    {
      name: 'options.moveThreshold.x',
      type: 'number',
      required: false,
      description: '水平方向の最大移動量（ピクセル）です。',
    },
    {
      name: 'options.moveThreshold.y',
      type: 'number',
      required: false,
      description: '垂直方向の最大移動量（ピクセル）です。',
    },
    {
      name: 'options.onClick',
      type: '(event) => void',
      required: false,
      description:
        '通常のクリック（押してから delay が経過する前に離す操作）で実行する関数です。省略できます。',
    },
    {
      name: 'options.onLongPressEnd',
      type: '(event) => void',
      required: false,
      description: '長押しが終了したときに実行する関数です。省略できます。',
    },
  ]"
/>

### 戻り値

<Interface
  name=""
  type="Object"
  description="要素に設定するイベントハンドラーです。"
  :nested="[
    {
      name: 'onMouseDown',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description: 'マウスボタンが押されたときのイベントハンドラーです。',
    },
    {
      name: 'onMouseUp',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description: 'マウスボタンが離されたときのイベントハンドラーです。',
    },
    {
      name: 'onMouseLeave',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description: 'マウスポインターが要素から離れたときのイベントハンドラーです。',
    },
    {
      name: 'onTouchStart',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description: 'タッチが開始されたときのイベントハンドラーです。',
    },
    {
      name: 'onTouchEnd',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description: 'タッチが終了したときのイベントハンドラーです。',
    },
    {
      name: 'onMouseMove',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description:
        'マウスが移動したときのイベントハンドラーです。<code>moveThreshold</code> が指定された場合に含まれます。',
    },
    {
      name: 'onTouchMove',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description:
        'タッチ位置が移動したときのイベントハンドラーです。<code>moveThreshold</code> が指定された場合に含まれます。',
    },
  ]"
/>

## 使用例

```tsx
import { useLongPress } from 'react-simplikit';

function ContextMenu() {
  const [menuVisible, setMenuVisible] = useState(false);

  const longPressHandlers = useLongPress(() => setMenuVisible(true), {
    delay: 400,
    onClick: () => console.log('Normal click'),
    onLongPressEnd: () => console.log('Long press completed'),
  });

  return (
    <div>
      <button {...longPressHandlers}>Press and hold</button>
      {menuVisible && <div className="context-menu">Context Menu</div>}
    </div>
  );
}
```
