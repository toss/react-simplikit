# useConditionalEffect

`useConditionalEffect` 是一个根据谓词函数条件性地执行 effects 的 React Hook。这让你在 effects 何时运行方面拥有比仅依赖变化 更多 的控制。

## 接口

```ts
function useConditionalEffect<T extends DependencyList>(
  effect: EffectCallback,
  deps: DependencyList,
  condition: (prevDeps: T | undefined, currentDeps: T) => boolean
): void;
```

### 参数

<Interface
  required
  name="effect"
  type="EffectCallback"
  description="要运行的 effect 回调。"
/>

<Interface
  required
  name="deps"
  type="DependencyList"
  description="依赖数组，与 useEffect 类似。"
/>

<Interface
  required
  name="condition"
  type="(prevDeps: T | undefined, currentDeps: T) => boolean"
  description="根据之前和当前的 deps 判断 effect 是否应该运行的函数。<br />- 在初始渲染时，<code>prevDeps</code> 将为 <code>undefined</code>。你的 <code>condition</code> 函数应该处理这种情况。<br />- 如果你希望 effect 在初始渲染时运行，则在 <code>prevDeps</code> 为 <code>undefined</code> 时返回 <code>true</code>。<br />- 如果你不希望 effect 在初始渲染时运行，则在 <code>prevDeps</code> 为 <code>undefined</code> 时返回 <code>false</code>。"
/>

### 返回值

此函数不返回任何内容。

## 示例

```tsx
import { useConditionalEffect } from 'react-simplikit';

function Component() {
  const [count, setCount] = useState(0);

  // Only run effect when count increases
  useConditionalEffect(
    () => {
      console.log(`Count increased to ${count}`);
    },
    [count],
    (prevDeps, currentDeps) => {
      // Only run when count is defined and has increased
      return prevDeps && currentDeps[0] > prevDeps[0];
    }
  );

  return (
    <button onClick={() => setCount(prev => prev + 1)}>
      Increment: {count}
    </button>
  );
}
```