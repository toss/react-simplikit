# usePrevious

`usePrevious` 是一个返回输入状态之前值的 React Hook。当发生未伴随状态变化的重复渲染时，它会原样保留之前的值。如果该状态是对象或需要自定义变化检测，则可以提供 `compare` 函数。默认情况下，状态变化通过 `prev === next` 来检测。

## 接口

```ts
function usePrevious<T>(state: T, compare?: (prev: T, next: T) => boolean): T;
```

### 参数

<Interface
  required
  name="state"
  type="T"
  description="要跟踪其之前值的状态。"
/>

<Interface
  name="compare"
  type="(prev: T, next: T) => boolean"
  description="用于判断状态是否发生变化的可选比较函数。"
/>

### 返回值

<Interface name="" type="T" description="状态之前的值。" />

## 示例

```tsx
const [count, setCount] = useState(0);
// initial value of previousCount is `0`
const previousCount = usePrevious(count);
```