# useIntersectionObserver

`useIntersectionObserver`는 특정 DOM 요소가 화면에 보이는지 감지하는 커스텀 훅이에요. 이 훅은 `IntersectionObserver` API를 사용해서 요소가 화면(viewport)에 들어오거나 나갈 때 콜백을 실행해요.

## 인터페이스

```typescript
function useIntersectionObserver<Element extends HTMLElement>(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit
): (element: Element | null) => void;
```

### 파라미터

- `callback` (`(entry: IntersectionObserverEntry) => void`)
  - 요소의 가시성이 변경될 때 실행할 콜백 함수예요.
  - `entry.isIntersecting` 값을 확인해서 요소가 화면 안에 있는지 판단할 수 있어요.
- `options` (`IntersectionObserverInit`):
  - [`IntersectionObserver`의 옵션](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver#options)을 설정할 수 있어요.
  - 예를 들어, 다음과 같은 값을 지정할 수 있어요.
    - `root`: 관찰할 뷰포트 또는 특정 요소예요. (`null`이면 기본 뷰포트 사용)
    - `rootMargin`: 감지 범위를 조정하는 여백 값이에요. (예: `"0px 0px -50px 0px"`)
    - `threshold`: 요소가 화면에 얼마나 보여야 콜백이 실행될지 설정해요. (예: `0.5`는 50% 이상 보일 때 실행)

### 반환 값

- `(element: Element | null) => void`
  - 이 함수를 ref 속성에 연결하면 해당 요소의 가시성이 바뀔 때마다 callback이 실행돼요.

## 예제

```tsx
import { useIntersectionObserver } from 'reactive-kit';

function Component() {
  const ref = useIntersectionObserver<HTMLDivElement>(
    entry => {
      if (entry.isIntersecting) {
        console.log('Element is in view:', entry.target);
      } else {
        console.log('Element is out of view:', entry.target);
      }
    },
    { threshold: 0.5 }
  );

  return <div ref={ref}>Observe me!</div>;
}
```

이 예제에서는 `useIntersectionObserver`를 사용해서 div 요소가 화면에 들어오거나 나갈 때 콘솔에 메시지를 출력해요.
