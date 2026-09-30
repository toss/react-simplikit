# useCallbackOnce

`useCallbackOnce` 是一个 React Hook，在 `deps` 变化之前，无论返回的函数被调用多少次，它都只会执行一次回调函数。它适用于那些即使组件重复渲染也不应重复执行的一次性操作。

## 接口

```ts
function useCallbackOnce<F extends (...args: any[]) => void>(
  callback: F,
  deps: DependencyList
): (...args: Parameters<F>) => void;
```

### 参数

<Interface
  required
  name="callback"
  type="F"
  description="只执行一次的回调函数。它会接收调用返回的函数时传入的参数。"
/>

<Interface
  required
  name="deps"
  type="DependencyList"
  description="依赖数组。依赖发生变化后，返回的函数可以再执行一次回调。"
/>

### 返回值

<Interface
  name=""
  type="(...args: Parameters<F>) => void"
  description="一个引用始终不变的函数。在 <code>deps</code> 变化之前，它只会执行一次回调。"
/>

## 示例

```tsx
import { useCallbackOnce } from 'react-simplikit';

function Component() {
  const handleOneTimeEvent = useCallbackOnce(() => {
    console.log('This will only run once');
  }, []);

  return <button onClick={handleOneTimeEvent}>Click me</button>;
}
```

```tsx
// With dependencies
function TrackingComponent({ userId }: { userId: string }) {
  const trackUserVisit = useCallbackOnce(() => {
    analytics.trackVisit(userId);
  }, [userId]);

  useEffect(() => {
    trackUserVisit();
  }, [trackUserVisit, userId]);

  return <div>User page</div>;
}
```
