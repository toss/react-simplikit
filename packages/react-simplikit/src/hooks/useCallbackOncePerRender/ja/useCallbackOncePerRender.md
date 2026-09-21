# useCallbackOncePerRender

`useCallbackOncePerRender` は、何度呼び出されてもコールバック関数を一度だけ実行する React フックです。
コンポーネントが再レンダリングされても繰り返すべきでない、一度限りの処理に便利です。

## インターフェース

```ts
function useCallbackOncePerRender<F extends (...args: any[]) => void>(
  callback: () => void,
  deps: DependencyList
): (...args: any[]) => void;
```

### パラメータ

<Interface
  required
  name="callback"
  type="() => void"
  description="一度だけ実行するコールバック関数。"
/>

<Interface
  required
  name="deps"
  type="DependencyList"
  description="値が変わると、再び一度だけ実行できるようになる依存配列。"
/>

### 戻り値

<Interface
  name=""
  type="(...args: any[]) => void"
  description="依存関係が変わるまで一度だけ実行される、メモ化された関数。"
/>

## 使用例

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
// 依存関係を指定する場合
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
