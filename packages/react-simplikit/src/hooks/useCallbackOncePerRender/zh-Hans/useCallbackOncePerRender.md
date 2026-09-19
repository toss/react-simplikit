# useCallbackOncePerRender

`useCallbackOncePerRender` 是一个确保回调函数无论被调用多少次都只执行一次的 React Hook。它适用于那些即使组件重复渲染也不应重复执行的一次性操作。

## 接口

```ts
function useCallbackOncePerRender<F extends (...args: any[]) => void>(
  callback: () => void,
  deps: DependencyList
): (...args: any[]) => void;
```

### 参数

<Interface
  required
  name="callback"
  type="() => void"
  description="只执行一次的回调函数。"
/>

<Interface
  required
  name="deps"
  type="DependencyList"
  description="依赖数组。当依赖发生变化时，会触发新的一次性执行。"
/>

### 返回值

<Interface
  name=""
  type="(...args: any[]) => void"
  description="一个记忆化函数，在依赖发生变化之前只会执行一次。"
/>

## 示例

```tsx
import { useCallbackOncePerRender } from 'react-simplikit';

function Component() {
  const handleOneTimeEvent = useCallbackOncePerRender(() => {
    console.log('This will only run once');
  }, []);

  return <button onClick={handleOneTimeEvent}>Click me</button>;
}
```

```tsx
// With dependencies
function TrackingComponent({ userId }: { userId: string }) {
  const trackUserVisit = useCallbackOncePerRender(() => {
    analytics.trackVisit(userId);
  }, [userId]);

  useEffect(() => {
    trackUserVisit();
  }, [trackUserVisit]);

  return <div>User page</div>;
}
```