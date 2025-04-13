# useRefEffect

`useRefEffect`는 특정 DOM 요소에 참조를 설정하고 요소가 변경될 때마다 콜백을 실행하는 데 도움을 주는 커스텀 훅이에요. 이 훅은 메모리 누수를 방지하기 위해 요소가 변경될 때마다 정리 함수를 호출해요.

## 인터페이스

```ts
function useRefEffect(
  callback: (element: Element) => CleanupCallback | void,
  deps: DependencyList
): (element: Element | null) => void;
```

### 파라미터

<Interface
  required
  name="callback"
  type="(element: Element) => CleanupCallback | void"
  description="요소가 설정될 때 실행되는 콜백 함수예요. 이 함수는 정리 함수를 반환할 수 있어요."
/>

<Interface
  required
  name="deps"
  type="DependencyList"
  description="콜백이 언제 다시 실행되어야 하는지 정의하는 의존성 배열이에요. <code>deps</code>가 변경될 때마다 <code>callback</code>이 다시 실행돼요."
/>

### 반환 값

<Interface
  name=""
  type="(element: Element | null) => void"
  description="요소를 설정하는 함수예요. 이 함수를 <code>ref</code> 속성에 전달하면, 요소가 변경될 때마다 <code>callback</code>이 호출돼요."
/>

## 예시

```tsx
import { useRefEffect } from 'react-simplikit';

function Component() {
  const ref = useRefEffect<HTMLDivElement>(element => {
    console.log('Element mounted:', element);

    return () => {
      console.log('Element unmounted:', element);
    };
  }, []);

  return <div ref={ref}>기본 예시</div>;
}
```
