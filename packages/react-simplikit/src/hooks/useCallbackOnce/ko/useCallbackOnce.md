# useCallbackOnce

`deps`가 바뀌기 전까지는 반환된 함수를 몇 번 호출하든 콜백을 한 번만 실행하는 리액트 훅이에요. 이는 컴포넌트가 다시 렌더링되더라도 반복되지 말아야 하는 일회성 작업에 유용해요.

## 인터페이스

```ts
function useCallbackOnce<F extends (...args: any[]) => void>(
  callback: F,
  deps: DependencyList
): (...args: Parameters<F>) => void;
```

### 파라미터

<Interface
  required
  name="callback"
  type="F"
  description="한 번 실행될 콜백 함수예요. 반환된 함수에 전달한 인자를 그대로 받아요."
/>

<Interface
  required
  name="deps"
  type="DependencyList"
  description="의존성 배열이에요. 값이 바뀌면 반환된 함수가 콜백을 한 번 더 실행할 수 있어요."
/>

### 반환 값

<Interface
  name=""
  type="(...args: Parameters<F>) => void"
  description="참조가 바뀌지 않는 함수예요. <code>deps</code>가 바뀌기 전까지는 콜백을 한 번만 실행해요."
/>

## 예시

```tsx
import { useCallbackOnce } from 'react-simplikit';

function Component() {
  const handleOneTimeEvent = useCallbackOnce(() => {
    console.log('이것은 한 번만 실행될 거예요');
  }, []);

  return <button onClick={handleOneTimeEvent}>누르세요</button>;
}
```

```tsx
// 의존성과 함께 사용하는 경우
function TrackingComponent({ userId }: { userId: string }) {
  const trackUserVisit = useCallbackOnce(() => {
    analytics.trackVisit(userId);
  }, [userId]);

  useEffect(() => {
    trackUserVisit();
  }, [trackUserVisit, userId]);

  return <div>사용자 페이지</div>;
}
```
