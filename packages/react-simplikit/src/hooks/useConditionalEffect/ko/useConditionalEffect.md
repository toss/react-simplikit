# useConditionalEffect

`useConditionalEffect`는 조건 함수의 결과에 따라 효과를 실행하는 리액트 훅이에요. 단순한 의존성 변경에만 기대지 않고 효과가 실행되는 시점을 더 잘 제어할 수 있어요.

## 인터페이스

```ts
function useConditionalEffect<T extends DependencyList>(
  effect: EffectCallback,
  deps: DependencyList,
  condition: (prevDeps: T | undefined, currentDeps: T) => boolean
): void;
```

### 파라미터

<Interface
  required
  name="effect"
  type="EffectCallback"
  description="실행할 효과 콜백이에요."
/>

<Interface
  required
  name="deps"
  type="DependencyList"
  description="useEffect와 유사한 의존성 배열이에요."
/>

<Interface
  required
  name="condition"
  type="(prevDeps: T | undefined, currentDeps: T) => boolean"
  description="이전 의존성과 현재 의존성을 보고 효과를 실행할지 정하는 함수예요. <br /> - 초기 렌더링에서는 <code>prevDeps</code>가 <code>undefined</code>예요. <code>condition</code> 함수는 이 경우를 처리해야 해요. <br /> - 초기 렌더링 시 효과를 실행하려면 <code>prevDeps</code>가 <code>undefined</code>일 때 <code>true</code>를 반환하면 돼요. <br /> - 초기 렌더링 시 효과를 실행하고 싶지 않다면 <code>prevDeps</code>가 <code>undefined</code>일 때 <code>false</code>를 반환하면 돼요."
/>

### 반환 값

이 함수는 아무것도 반환하지 않아요.

## 예시

```tsx
import { useConditionalEffect } from 'react-simplikit';

function Component() {
  const [count, setCount] = useState(0);

  // 카운트가 증가할 때만 효과를 실행해요
  useConditionalEffect(
    () => {
      console.log(`카운트가 ${count}로 증가했어요`);
    },
    [count],
    (prevDeps, currentDeps) => {
      // 카운트가 정의되었고 증가했을 때만 실행해요
      return prevDeps && currentDeps[0] > prevDeps[0];
    }
  );

  return (
    <button onClick={() => setCount(prev => prev + 1)}>증가: {count}</button>
  );
}
```
