# useLongPress

`useLongPress` は、要素が指定した時間押し続けられたことを検出する React フックです。
ポインターイベントを受け取るので、マウス、タッチ、ペンによる押下は 1 つのストリームになり、タップのあとに続くエミュレートされたマウスイベントが 2 回目の押下を始めることはありません。
`pointercancel` は押下をキャンセルします。ブラウザーがスクロールのためにポインターを受け取る場合も含まれます。
主ポインターではないポインターと、主ボタン以外のボタンは無視します。

## インターフェース

```ts
function useLongPress<E extends HTMLElement>(
  onLongPress: (event: React.PointerEvent<E>) => void,
  options?: UseLongPressOptions
): Object;
```

### パラメータ

<Interface
  required
  name="onLongPress"
  type="(event: React.PointerEvent<E>) => void"
  description="長押しが検出されたときに実行するコールバック関数です。"
/>

<Interface
  name="options"
  type="UseLongPressOptions"
  description="長押しの動作を設定するオプションです。"
  :nested="[
    {
      name: 'options.delayMs',
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
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description:
        '通常のクリック（押してから delayMs が経過する前に離す操作）で実行する関数です。省略できます。',
    },
    {
      name: 'options.onLongPressEnd',
      type: '(event: React.PointerEvent<E>) => void',
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
      name: 'onPointerDown',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description: '主ポインターの主ボタンで押下を開始します。',
    },
    {
      name: 'onPointerUp',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description:
        '追跡中の押下を終了します。遅延前に離すと <code>onClick</code> を呼び出し、長押しがすでに発火している場合は <code>onLongPressEnd</code> を呼び出します。',
    },
    {
      name: 'onPointerLeave',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description:
        'ポインターが要素から離れると、追跡中の押下をキャンセルします。<code>onClick</code> は呼び出しません。長押しがすでに発火している場合は <code>onLongPressEnd</code> を呼び出します。',
    },
    {
      name: 'onPointerCancel',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description:
        'ブラウザーがポインターをキャンセルしたとき（たとえばスクロールが始まったとき）に、追跡中の押下をキャンセルします。<code>onClick</code> は呼び出しません。長押しがすでに発火している場合は <code>onLongPressEnd</code> を呼び出します。',
    },
    {
      name: 'onPointerMove',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description:
        '移動量が <code>moveThreshold</code> を超えると、保留中の長押しをキャンセルします。<code>moveThreshold</code> が指定された場合に含まれます。',
    },
  ]"
/>

## 使用例

```tsx
import { useLongPress } from 'react-simplikit';

function ContextMenu() {
  const [menuVisible, setMenuVisible] = useState(false);

  const longPressHandlers = useLongPress(() => setMenuVisible(true), {
    delayMs: 400,
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
