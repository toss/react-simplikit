# useCallbackOncePerRender

`useCallbackOncePerRender`는 콜백 함수를 몇 번 호출하든 한 번만 실행되도록 보장하는 리액트 훅이에요. 컴포넌트가 다시 렌더링되어도 반복하면 안 되는 일회성 작업에 유용해요.

## 인터페이스

```ts
function useCallbackOncePerRender<F extends (...args: any[]) => void>(
  callback: () => void,
  deps: DependencyList
): (...args: any[]) => void;
```

### 파라미터

<Interface
  required
  name="callback"
  type="() => void"
  description="한 번 실행될 콜백 함수예요."
/>

<Interface
  required
  name="deps"
  type="DependencyList"
  description="값이 바뀌면 콜백을 다시 한 번 실행할 수 있게 하는 의존성 배열이에요."
/>

### 반환 값

<Interface
  name=""
  type="(...args: any[]) => void"
  description="의존성이 바뀔 때까지 한 번만 실행되는 메모이제이션된 함수예요."
/>

## 예시

```tsx
import { useCallbackOncePerRender } from 'react-simplikit';

function Component() {
  const handleOneTimeEvent = useCallbackOncePerRender(() => {
    console.log('이것은 한 번만 실행될 거예요');
  }, []);

  return <button onClick={handleOneTimeEvent}>누르세요</button>;
}
```

```tsx
// 의존성과 함께 사용하는 경우
function TrackingComponent({ userId }: { userId: string }) {
  const trackUserVisit = useCallbackOncePerRender(() => {
    analytics.trackVisit(userId);
  }, [userId]);

  useEffect(() => {
    trackUserVisit();
  }, [trackUserVisit]);

  return <div>사용자 페이지</div>;
}
```
