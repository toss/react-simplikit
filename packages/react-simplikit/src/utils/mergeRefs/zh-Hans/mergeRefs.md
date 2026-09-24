# mergeRefs

`mergeRefs` 接收多个 ref（RefObject 或 RefCallback），返回一个能更新所有传入 ref 的单一 ref。当你需要向单个元素同时传递多个 ref 时很有用。当回调 ref 返回清理函数（React 19）时，合并后的 ref 也会返回一个清理函数，并在卸载时执行所有清理操作。

## 接口

```ts
function mergeRefs<T>(
  ...refs: Array<RefObject<T> | RefCallback<T> | null | undefined>
): RefCallback<T>;
```

### 参数

<Interface
  required
  name="refs"
  type="Array<RefObject<T> | RefCallback<T> | null | undefined>"
  description="要合并的 ref 数组。每个 ref 可以是 RefObject 或 RefCallback。"
/>

### 返回值

<Interface
  name=""
  type="RefCallback<T>"
  description="一个会更新所有传入 ref 的回调 ref。"
/>

## 示例

```tsx
forwardRef(function Component(props, parentRef) {
  const myRef = useRef(null);

  return <div ref={mergeRefs(myRef, parentRef)} />;
});
```

```tsx
function Component(props) {
  const ref = useRef(null);
  const eight, setHeight] = useState(0);

  const measuredRef = useCallback(node => {
    if (node == null) {
      return;
    }

    setHeight(node.offsetHeight);
  }, []);

  return <div ref={mergeRefs(measuredRef, ref)} />;
}
```
