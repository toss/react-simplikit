# mergeProps

`mergeProps` は、複数の props オブジェクトを 1 つのオブジェクトにマージするユーティリティ関数です。
`className`、`style`、`function` の各プロパティのマージを処理します。

## インターフェース

```ts
function mergeProps<PropsList>(
  ...props: PropsList
): TupleToIntersection<PropsList>;
```

### パラメータ

<Interface
  required
  name="props"
  type="PropsList"
  description="マージする props オブジェクト。"
/>

### 戻り値

<Interface
  name=""
  type="TupleToIntersection<PropsList>"
  description="マージされた props オブジェクト。"
/>

## 使用例

```tsx
const mergedProps = mergeProps(
  { className: 'foo', style: { color: 'red' } },
  { className: 'bar', style: { backgroundColor: 'blue' } }
);
console.log(mergedProps); // { className: 'foo bar', style: { color: 'red', backgroundColor: 'blue' } }
```
