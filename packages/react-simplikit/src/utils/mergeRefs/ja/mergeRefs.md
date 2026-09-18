# mergeRefs

この関数は複数の ref（RefObject または RefCallback）を受け取り、渡されたすべての ref を更新する単一の ref を返します。
1 つの要素に複数の ref を渡す必要がある場合に便利です。
コールバック ref がクリーンアップ関数を返す場合（React 19）、マージされた ref もクリーンアップ関数を返し、ref が切り離される際にすべてのクリーンアップを実行します。

## インターフェース

```ts
function mergeRefs<T>(
  ...refs: Array<RefObject<T> | RefCallback<T> | null | undefined>
): RefCallback<T>;
```

### パラメータ

<Interface
  required
  name="refs"
  type="Array<RefObject<T> | RefCallback<T> | null | undefined>"
  description="マージする ref の配列。各 ref は RefObject または RefCallback です。"
/>

### 戻り値

<Interface
  name=""
  type="RefCallback<T>"
  description="渡されたすべての ref を更新する単一の ref コールバック。"
/>

## 使用例

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
