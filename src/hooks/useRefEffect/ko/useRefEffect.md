# useRefEffect

`useRefEffect`는 특정 DOM 요소에 대한 참조를 설정하고, 해당 요소가 변경될 때마다 콜백을 실행하는 커스텀 훅이에요. 이 훅은 요소가 변경될 때마다 정리(cleanup) 함수를 호출해서 메모리 누수를 방지해요.

## 인터페이스

```typescript
function useRefEffect<Element extends HTMLElement = HTMLElement>(
  callback: (element: Element) => CleanupCallback | void,
  deps: DependencyList
): (element: Element | null) => void;
```

### 파라미터

- `callback` (`(element: Element) => CleanupCallback | void`): 요소가 설정될 때 실행할 콜백 함수입니다. 이 함수는 정리(cleanup) 함수를 반환할 수 있어요.
- `deps` (`DependencyList`): 콜백이 다시 실행될 조건을 정의하는 의존성 배열이에요.
  deps 값이 변경되면 `callback`이 다시 실행돼요.

### 반환 값

- `(element: Element | null) => void`: 요소를 설정하는 함수예요.
  이 함수를 ref 속성에 넘기면 요소가 변경될 때마다 `callback`이 호출돼요.

## 예제

```tsx
import { useRefEffect } from 'react-simplikit';

function Component() {
  const ref = useRefEffect<HTMLDivElement>(element => {
    console.log('Element mounted:', element);

    return () => {
      console.log('Element unmounted:', element);
    };
  }, []);

  return <div ref={ref}>Basic Example</div>;
}
```

이 예제에서는 `useRefEffect`를 사용해서 div 요소가 마운트될 때와 언마운트될 때 콘솔에 메시지를 출력해요.
