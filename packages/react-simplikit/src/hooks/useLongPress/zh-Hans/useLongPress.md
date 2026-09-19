# useLongPress

`useLongPress` 是一个检测元素被按压并按住指定时长的 React Hook。它同时处理鼠标和触摸事件，使它在桌面和移动设备上都能一致地工作。

## 接口

```ts
function useLongPress<E extends HTMLElement>(
  onLongPress: (event: React.MouseEvent<E> | React.TouchEvent<E>) => void,
  options?: UseLongPressOptions
): Object;
```

### 参数

<Interface
  required
  name="onLongPress"
  type="(event: React.MouseEvent<E> | React.TouchEvent<E>) => void"
  description="检测到长按时执行的回调函数。"
/>

<Interface
  name="options"
  type="UseLongPressOptions"
  description="用于长按行为的配置选项。"
  :nested="[
    {
      name: 'options.delay',
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
      type: '(event) => void',
      required: false,
      description:
        '在普通点击（在延迟之前按压并释放）时执行的可选函数。',
    },
    {
      name: 'options.onLongPressEnd',
      type: '(event) => void',
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
      name: 'onMouseDown',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description: '用于鼠标按下事件的事件处理函数。',
    },
    {
      name: 'onMouseUp',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description: '用于鼠标抬起事件的事件处理函数。',
    },
    {
      name: 'onMouseLeave',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description: '用于鼠标离开事件的事件处理函数。',
    },
    {
      name: 'onTouchStart',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description: '用于触摸开始事件的事件处理函数。',
    },
    {
      name: 'onTouchEnd',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description: '用于触摸结束事件的事件处理函数。',
    },
    {
      name: 'onMouseMove',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description:
        '用于鼠标移动事件的事件处理函数。仅在提供了 <code>moveThreshold</code> 时包含。',
    },
    {
      name: 'onTouchMove',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description:
        '用于触摸移动事件的事件处理函数。仅在提供了 <code>moveThreshold</code> 时包含。',
    },
  ]"
/>

## 示例

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