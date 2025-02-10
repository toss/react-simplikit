# useThrottle

`useThrottle`은 React에서 특정 시간 간격마다 함수 호출을 제한하는 훅이에요. 성능 최적화가 필요한 경우, 특히 **사용자가 빠르게 입력하거나 스크롤할 때** 불필요한 함수 호출을 방지하는 데 유용해요.

## 인터페이스

```ts
function useThrottle<F extends (...args: any[]) => any>(
  callback: F,
  wait: number,
  options?: ThrottleOptions
): F & { cancel: () => void };
```

### 매개변수

- `callback` (`F`): 지정한 시간 간격 내에서 실행할 함수예요.
- `wait` (`number`): 함수 실행 간격을 밀리초(단위: ms)로 설정해요.
- `options` (`ThrottleOptions`, 선택 사항):
  - `leading` (`boolean`): true이면 첫 실행 시점에 callback을 즉시 실행해요. 기본값은 false예요.
  - `trailing` (`boolean`): true이면 지연이 끝난 후 마지막 callback을 실행해요. 기본값은 true예요.

### 반환값

- 제한된 호출을 적용한 함수와 cancel 메서드를 포함한 객체를 반환해요.
- cancel() 메서드를 호출하면, 대기 중인 실행을 취소할 수 있어요.

## 예시

```tsx
import { useThrottle } from 'reactive-kit';
import { useEffect } from 'react';

function ThrottledComponent() {
  const handleScroll = useThrottle(() => {
    console.log('스크롤 이벤트 발생');
  }, 200);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      handleScroll.cancel();
    };
  }, [handleScroll]);

  return <div>스크롤을 해보세요!</div>;
}
```
