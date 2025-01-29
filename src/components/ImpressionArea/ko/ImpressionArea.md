# ImpressionArea

`ImpressionArea`는 특정 DOM 요소가 화면에 보이는 시간을 측정하고, 요소가 화면에 들어오거나 나갈 때 콜백을 실행하는 컴포넌트예요. 이 컴포넌트는 [useImpressionRef](../hooks/useImpressionRef) 훅을 사용하여 요소의 가시성을 추적해요.
œ

## Props

- `onImpressionStart`: 요소가 화면에 들어올 때 실행할 콜백 함수
- `onImpressionEnd`: 요소가 화면에서 나갈 때 실행할 콜백 함수
- `timeThreshold`: 요소가 화면에 보여야 하는 최소 시간 (밀리초)
- `areaThreshold`: 요소가 화면에 보여야 하는 최소 비율 (0 ~ 1)
- `rootMargin`: 감지 범위를 조정하는 여백 값
- `as`: 렌더링할 HTML 태그 (기본값: `div`)
- `children`: 자식 요소

## 예제

```tsx
import { ImpressionArea } from 'reactive-kit';

function App() {
  return (
    <ImpressionArea
      onImpressionStart={() => console.log('Element entered view')}
      onImpressionEnd={() => console.log('Element exited view')}
      timeThreshold={1000}
      areaThreshold={0.5}
    >
      <div>Track my visibility!</div>
    </ImpressionArea>
  );
}
```

이 예제에서는 `ImpressionArea`를 사용하여 `div` 요소가 화면에 들어오거나 나갈 때 콘솔에 메시지를 출력합니다.
