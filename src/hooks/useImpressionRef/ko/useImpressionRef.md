# useImpressionRef

`useImpressionRef`는 특정 DOM 요소가 화면에 보이는 시간을 측정하고, 요소가 화면에 들어오거나 나갈 때 콜백을 실행하는 커스텀 훅이에요. 이 훅은 [useIntersectionObserver](./useIntersectionObserver)와 [useVisibilityEvent](./useVisibilityEvent)를 사용해서 요소의 가시성을 추적해요.

## 인터페이스

```typescript
function useImpressionRef<Element extends HTMLElement = HTMLElement>(
  options: UseImpressionRefOptions
): (element: Element | null) => void;
```

### 파라미터

- `options` (`UseImpressionRefOptions`): 요소의 가시성을 추적하기 위한 설정 객체이에요.
  - `onImpressionStart`: 요소가 화면에 들어올 때 실행할 콜백이에요.
  - `onImpressionEnd`: 요소가 화면에서 나갈 때 실행할 콜백이에요.
  - `timeThreshold`: 요소가 화면에 보여야 하는 최소 시간이에요. (밀리초)
  - `areaThreshold`: 요소가 화면에 보여야 하는 최소 비율이예요. (0 ~ 1)
  - `rootMargin`: 감지 범위를 조정하는 여백 값이에요.

### 반환 값

- `(element: Element | null) => void`: 요소를 설정하는 함수예요. 이 함수를 `ref` 속성에 넘기면 요소의 가시성이 변경될 때마다 콜백이 호출돼요.

## 예제

```tsx
import { useImpressionRef } from 'react-simplikit';

function Component() {
  const ref = useImpressionRef<HTMLDivElement>({
    onImpressionStart: () => console.log('Element entered view'),
    onImpressionEnd: () => console.log('Element exited view'),
    timeThreshold: 1000,
    areaThreshold: 0.5,
  });

  return <div ref={ref}>Track my visibility!</div>;
}
```

이 예제에서는 `useImpressionRef`를 사용해서 `div` 요소가 화면에 들어오거나 나갈 때 콘솔에 메시지를 출력해요.
