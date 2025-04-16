# useImpressionRef

`useImpressionRef`는 특정 DOM 요소가 화면에 보이는 시간을 측정하고 요소가 뷰포트에 들어가거나 나갈 때 콜백을 실행하는 커스텀 훅이에요. 이 훅은 `IntersectionObserver`와 `Visibility API`를 사용해서 요소의 가시성을 추적해요.

## 인터페이스

```ts
function useImpressionRef(
  options: UseImpressionRefOptions
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
      required: false,
      description:
        '요소가 뷰에 들어갈 때 실행되는 콜백 함수예요',
    },
    {
      name: 'options.onImpressionEnd',
      type: '() => void',
      required: false,
      description: '요소가 뷰에서 나갈 때 실행되는 콜백 함수예요',
    },
    {
      name: 'options.timeThreshold',
      type: 'number',
      required: false,
      defaultValue: '0',
      description: '요소가 보여야 하는 최소 시간 (밀리초 단위)예요',
    },
    {
      name: 'options.areaThreshold',
      type: 'number',
      required: false,
      defaultValue: '0',
      description: '요소가 보여야 하는 최소 비율 (0에서 1 사이)예요',
    },
    {
      name: 'options.rootMargin',
      type: 'string',
      required: true,
      description: '감지 영역을 조정하는 마진이에요',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="(element: Element | null) => void"
  description="요소를 설정하기 위한 함수예요. 이 함수를 <code>ref</code> 속성에 첨부하면 요소의 가시성이 변경될 때마다 콜백이 실행돼요."
/>

## 예시

```tsx
import { useImpressionRef } from 'react-simplikit';

function Component() {
  const ref = useImpressionRef<HTMLDivElement>({
    onImpressionStart: () => console.log('Element entered view'),
    onImpressionEnd: () => console.log('Element exited view'),
    timeThreshold: 1000,
    areaThreshold: 0.5,
  });

  return <div ref={ref}>내 가시성을 추적해줘요!</div>;
}
```
