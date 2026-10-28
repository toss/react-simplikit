# useLongPress

`useLongPress` 是一个检测元素被按压并按住指定时长的 React Hook。
它监听指针事件，因此鼠标、触摸或触控笔的一次按压属于同一条事件流，轻点之后浏览器模拟的鼠标事件不会开始第二次按压。
`pointercancel` 会取消这次按压，包括浏览器为了滚动而接管指针的情况。
非主指针以及主按钮以外的任何按钮都会被忽略。

## 接口

```ts
function useLongPress<E extends HTMLElement>(
  onLongPress: (event: React.PointerEvent<E>) => void,
  options?: UseLongPressOptions
): Object;
```

### 参数

<Interface
  required
  name="onLongPress"
  type="(event: React.PointerEvent<E>) => void"
  description="检测到长按时执行的回调函数。"
/>

<Interface
  name="options"
  type="UseLongPressOptions"
  description="用于长按行为的配置选项。"
  :nested="[
    {
      name: 'options.delayMs',
      type: 'number',
      required: false,
      defaultValue: '500',
      description:
        '触发长按之前的毫秒数。默认为 500 毫秒。',
    },
    {
      name: 'options.moveThreshold',
      type: 'Object',
      required: false,
      description: '取消长按之前允许的最大移动距离。',
    },
    {
      name: 'options.moveThreshold.x',
      type: 'number',
      required: false,
      description: '最大水平移动距离，以像素为单位。',
    },
    {
      name: 'options.moveThreshold.y',
      type: 'number',
      required: false,
      description: '最大垂直移动距离，以像素为单位。',
    },
    {
      name: 'options.onClick',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description:
        '在普通点击（在延迟之前按压并释放）时执行的可选函数。',
    },
    {
      name: 'options.onLongPressEnd',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description: '长按结束时执行的可选函数。',
    },
  ]"
/>

### 返回值

<Interface
  name=""
  type="Object"
  description="要附加到元素上的事件处理函数。"
  :nested="[
    {
      name: 'onPointerDown',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description: '用主指针的主按钮开始一次按压。',
    },
    {
      name: 'onPointerUp',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description:
        '结束正在跟踪的按压。如果在延迟之前松开，则调用 <code>onClick</code>；如果长按已经触发，则调用 <code>onLongPressEnd</code>。',
    },
    {
      name: 'onPointerLeave',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description:
        '指针离开元素时取消正在跟踪的按压。不会调用 <code>onClick</code>。如果长按已经触发，则调用 <code>onLongPressEnd</code>。',
    },
    {
      name: 'onPointerCancel',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description:
        '浏览器取消指针时取消正在跟踪的按压，例如开始滚动时。不会调用 <code>onClick</code>。如果长按已经触发，则调用 <code>onLongPressEnd</code>。',
    },
    {
      name: 'onPointerMove',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description:
        '移动距离超过 <code>moveThreshold</code> 时取消尚未触发的长按。仅在提供了 <code>moveThreshold</code> 时包含。',
    },
  ]"
/>

## 示例

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
