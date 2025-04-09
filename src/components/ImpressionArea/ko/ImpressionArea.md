# ImpressionArea

`ImpressionArea`는 특정 DOM 요소가 화면에 보이는 시간을 측정하고, 요소가 화면에 들어오거나 나갈 때 콜백을 실행하는 컴포넌트예요. 이 컴포넌트는 [useImpressionRef](../hooks/useImpressionRef) 훅을 사용하여 요소의 가시성을 추적해요.

## 인터페이스

```tsx
function ImpressionArea<T extends ElementType = 'div'>({
  as,
  rootMargin,
  areaThreshold,
  timeThreshold,
  onImpressionStart,
  onImpressionEnd,
  ref,
  ...props
}: Props<T>): JSX.Element;
```

### 파라미터

- `as` (`ElementType`): 렌더링 할 HTML 태그예요. (기본값: `div`)
- `rootMargin` (`string`): 감지 범위를 조정하는 여백 값이에요.
- `areaThreshold` (`number`): 요소가 화면에 보여야 하는 최소 비율이에요. (0 ~ 1)
- `timeThreshold` (`number`): 요소가 화면에 보여야 하는 최소 시간이에요. (밀리초)
- `onImpressionStart` (`() => void`): 요소가 화면에 들어올 때 실행할 콜백 함수예요.
- `onImpressionEnd` (`() => void`): 요소가 화면에서 나갈 때 실행할 콜백 함수예요.
- `ref` (`Ref<HTMLElement>`): 요소에 대한 참조예요.
- `props` (`Props<T>`): `as` 에서 넘긴 태그의 props 예요.

### 반환 값

이 컴포넌트는 JSX 요소를 반환해요.

## 예시

```tsx
import { ImpressionArea } from 'react-simplikit';

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
