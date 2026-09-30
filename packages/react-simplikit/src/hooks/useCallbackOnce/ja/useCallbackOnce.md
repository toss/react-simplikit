# useCallbackOnce

`useCallbackOnce` は、返された関数が何度呼び出されても、`deps` が変わるまではコールバック関数を一度だけ実行する React フックです。
コンポーネントが再レンダリングされても繰り返すべきでない、一度限りの処理に便利です。

## インターフェース

```ts
function useCallbackOnce<F extends (...args: any[]) => void>(
  callback: F,
  deps: DependencyList
): (...args: Parameters<F>) => void;
```

### パラメータ

<Interface
  required
  name="callback"
  type="F"
  description="一度だけ実行するコールバック関数。返された関数に渡した引数をそのまま受け取ります。"
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
  type="(...args: Parameters<F>) => void"
  description="参照が変わらない関数。<code>deps</code> が変わるまでは、コールバックを一度だけ実行します。"
/>

## 使用例

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
// 依存関係を指定する場合
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
