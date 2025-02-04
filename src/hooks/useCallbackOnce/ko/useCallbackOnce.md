# `useCallbackOnce`

`useCallbackOnce`는 콜백 함수가 여러 번 호출되더라도 단 한 번만 실행되도록 보장하는 React 훅이에요.  
이는 분석 추적, 초기화 코드, 또는 반복되면 안 되는 다른 사이드 이펙트와 같은 일회성 작업에 특히 유용해요.

## 인터페이스

```typescript
function useCallbackOnce<F extends (...args: any[]) => void>(
  callback: F,
  deps: DependencyList
): (...args: Parameters<F>) => void;
```

### 매개변수

- `callback`: 한 번만 실행될 함수예요. 첫 실행 이후의 호출은 무시돼요.

- `deps`: 의존성 배열이에요. 이 값이 변경되면 실행 상태가 초기화되어 콜백이 다시 한 번 실행될 수 있어요.

### 반환값

원래 콜백을 감싸고 의존성이 변경될 때까지 한 번만 실행되도록 보장하는 함수를 반환해요.

## 사용 예시

### 기본 사용

사용자의 첫 상호작용을 추적하는 예제예요:

```tsx
import { useCallbackOnce } from 'reactive-kit';

function UserInteraction() {
  const trackFirstInteraction = useCallbackOnce(() => {
    analytics.track('first_interaction');
  }, []);

  return <button onClick={trackFirstInteraction}>상호작용</button>;
}
```

### 의존성 사용

사용자 ID가 변경될 때 방문을 추적하는 예제예요:

```tsx
import { useCallbackOnce } from 'reactive-kit';
import { useEffect } from 'react';

function UserTracker({ userId }: { userId: string }) {
  const trackUserVisit = useCallbackOnce(() => {
    analytics.trackVisit(userId);
  }, [userId]); // userId가 변경되면 초기화되고 다시 실행돼요

  useEffect(() => {
    trackUserVisit();
  }, [trackUserVisit]);

  return <div>추적 중인 사용자: {userId}</div>;
}
```
