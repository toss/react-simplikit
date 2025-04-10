# useImpressionRef

`useImpressionRef`는 특정 DOM 요소가 화면에 보이는 시간을 측정하고, 요소가 뷰포트에 들어가거나 나갈 때 콜백을 실행하는 커스텀 훅이에요. 이 훅은 요소의 가시성을 추적하기 위해 `IntersectionObserver`와 `Visibility API`를 사용해요.

## Interface
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
        '요소가 화면에 들어갈 때 실행되는 콜백 함수예요',
    },
    {
      name: 'options.onImpressionEnd',
      type: '() => void',
      description: '요소가 화면에서 나갈 때 실행되는 콜백 함수예요',
    },
    {
      name: 'options.timeThreshold',
      type: 'number',
      description: '요소가 최소한 보여져야 하는 시간 (밀리초 기준)이에요',
    },
    {
      name: 'options.areaThreshold',
      type: 'number',
      description: '요소가 최소한 보여져야 하는 비율 (0~1 사이)예요',
    },
    {
      name: 'options.rootMargin',
      type: 'string',
      description: '탐지 영역을 조정하기 위한 여백이에요',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="(element: Element | null) => void"
  description="요소를 설정하기 위한 함수예요. 이 함수를 <code>ref</code> 속성에 첨부하면 요소의 가시성이 변경될 때마다 콜백을 실행할 거예요."
/>


## 예시

```tsx
import { useImpressionRef } from 'react-simplikit';

function Component() {
  const ref = useImpressionRef<HTMLDivElement>({
    onImpressionStart: () => console.log('요소가 화면에 들어갔어요'),
    onImpressionEnd: () => console.log('요소가 화면에서 나갔어요'),
    timeThreshold: 1000,
    areaThreshold: 0.5,
  });

  return <div ref={ref}>내 가시성을 추적해 주세요!</div>;
}
```

