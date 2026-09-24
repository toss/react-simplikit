# mergeRefs

此函数接收多个 refs（RefObject 或 RefCallback），并返回一个更新所有提供 refs 的单一 ref。当需要向单个元素传递多个 refs 时非常有用。如果回调 ref 返回清理函数（React 19），合并后的 ref 也会返回清理函数，并在分离时执行所有清理函数。

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
  description="要合并的 refs 数组。每个 ref 可以是 RefObject 或 RefCallback 之一。"
/>

### 返回值

<Interface
  name=""
  type="RefCallback<T>"
  description="更新所有提供 refs 的单一 ref 回调。"
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
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback(node => {
    if (node == null) {
      return;
    }

    setHeight(node.offsetHeight);
  }, []);

  return <div ref={mergeRefs(measuredRef, ref)} />;
}
```
