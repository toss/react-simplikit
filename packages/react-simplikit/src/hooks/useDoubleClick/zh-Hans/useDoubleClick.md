# useDoubleClick

`useDoubleClick` 是一个区分单击和双击事件的 React Hook。它会将单击回调的执行延迟指定的一段时间，如果在这段时间内发生了第二次点击（即双击），则取消该回调。

## 接口

```ts
function useDoubleClick<E extends HTMLElement>(
  props: Object
): (event: MouseEvent<E>) => void;
```

### 参数

<Interface
  required
  name="props"
  type="Object"
  description="用于点击处理的配置选项。"
  :nested="[
    {
      name: 'props.delay',
      type: 'number',
      required: false,
      defaultValue: '250',
      description:
        '触发单击回调之前等待的毫秒数。默认为 250 毫秒。',
    },
    {
      name: 'props.click',
      type: '(event: MouseEvent<E>) => void',
      required: false,
      description: '在单击时执行的回调函数。',
    },
    {
      name: 'props.doubleClick',
      type: '(event: MouseEvent<E>) => void',
      required: true,
      description:
        '在双击时执行的回调函数。必填。',
    },
  ]"
/>

### 返回值

<Interface
  name=""
  type="(event: MouseEvent<E>) => void"
  description="一个点击处理函数，用于附加到元素的 <code>onClick</code> 事件。"
/>

## 示例

```tsx
function GalleryCard() {
  const [selected, setSelected] = useState(false);

  const handleClick = () => setSelected(prev => !prev);
  const handleDoubleClick = () => alert('Zoom in!');

  const handleEvent = useDoubleClick({
    click: handleClick,
    doubleClick: handleDoubleClick,
  });

  return (
    <div onClick={handleEvent}>{selected ? 'Selected' : 'Not selected'}</div>
  );
}
```