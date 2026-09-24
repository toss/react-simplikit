# mergeProps

`mergeProps` 是将多个 props 对象合并为一个对象的工具函数。它会处理 `className`、`style` 以及 `function` 属性的合并。

## 接口

```ts
function mergeProps<PropsList>(
  ...props: PropsList
): TupleToIntersection<PropsList>;
```

### 参数

<Interface
  required
  name="props"
  type="PropsList"
  description="要合并的 props 对象。"
/>

### 返回值

<Interface
  name=""
  type="TupleToIntersection<PropsList>"
  description="合并后的 props 对象。"
/>

## 示例

```tsx
const mergedProps = mergeProps(
  { className: 'foo', style: { color: 'red' } },
  { className: 'bar', style: { backgroundColor: 'blue' } }
);
console.log(mergedProps); // { className: 'foo bar', style: { color: 'red', backgroundColor: 'blue' } }
```
