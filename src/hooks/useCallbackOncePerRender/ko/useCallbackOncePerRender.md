# useCallbackOncePerRender

리액트 훅으로, 콜백 함수가 한 번만 실행되도록 보장해요. 몇 번 호출되든 간에 단 한 번만 실행돼요. 이는 컴포넌트가 다시 렌더링되더라도 반복되지 말아야 하는 일회성 작업에 유용해요.

## 인터페이스

```ts
function useCallbackOncePerRender(
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
  description="변경될 때 새로운 일회성 실행을 트리거하는 의존성 배열이에요."
/>

### 반환 값

<Interface
  name=""
  type="(...args: any[]) => void"
  description="의존성이 변경될 때까지 한 번만 실행될 메모이제이션된 함수예요."
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
