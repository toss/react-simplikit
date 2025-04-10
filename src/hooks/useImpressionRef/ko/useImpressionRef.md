# useImpressionRef

`useImpressionRef`는 특정 DOM 요소가 화면에 표시되는 시간을 측정하고, 요소가 뷰포트 안으로 들어오거나 나갈 때 콜백을 실행하는 커스텀 훅이에요. 이 훅은 `IntersectionObserver`와 `Visibility API`를 사용하여 요소의 가시성을 추적해요.

## 인터페이스
```ts
function useImpressionRef(
  options: UseImpressionRefOptions,
): (element: Element | null) => void;

```

### 파라미터

<Interface
  required
  name="options"
  type="UseImpressionRefOptions"
  description="요소의 가시성을 추적하기 위한 옵션이에요."
  :nested="[
    {
      name: 'options.onImpressionStart',
      type: '() => void',
      description:
        '요소가 뷰에 들어올 때 실행되는 콜백 함수예요',
    },
    {
      name: 'options.onImpressionEnd',
      type: '() => void',
      description: '요소가 뷰에서 나갈 때 실행되는 콜백 함수예요',
    },
    {
      name: 'options.timeThreshold',
      type: 'number',
      description: '요소가 최소한 보여져야 하는 시간이에요 (밀리초 단위)',
    },
    {
      name: 'options.areaThreshold',
      type: 'number',
      description: '요소가 최소한 보여져야 하는 비율이에요 (0에서 1까지)',
    },
    {
      name: 'options.rootMargin',
      type: 'string',
      description: '감지 영역을 조정하기 위한 여백이에요',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="(element: Element | null) => void"
  description="요소를 설정하는 함수예요. 이 함수를 <code>ref</code> 속성에 연결하면, 요소의 가시성이 변경될 때마다 콜백이 실행돼요."
/>


## 예시

```tsx
import { useImpressionRef } from 'react-simplikit';

function Component() {
  const ref = useImressionRef<HTMLDivElement>({
    onImpressionStart: () => console.log('요소가 뷰에 들어왔어요'),
    onImpressionEnd: () => console.log('요소가 뷰에서 나갔어요'),
    timeThreshold: 1000,
    areaThreshold: 0.5,
  });

  return <div ref={ref}>내 가시성을 추적해 주세요!</div>;
}
```

