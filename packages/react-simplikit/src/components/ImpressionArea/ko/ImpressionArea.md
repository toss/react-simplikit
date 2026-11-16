# ImpressionArea

`ImpressionArea`는 특정 DOM 요소가 화면에 보이는 시간을 측정하고 요소가 뷰포트에 들어오거나 나갈 때 콜백을 실행하는 컴포넌트예요. 요소의 가시성은 `useImpressionRef` 훅으로 추적해요.

## 인터페이스

```ts
function ImpressionArea<T extends ElementType>(
  as: T = 'div',
  rootMargin?: string,
  areaThreshold?: number,
  timeThresholdMs?: number,
  onImpressionStart?: () => void,
  onImpressionEnd?: () => void,
  ref?: Ref<Element<T>>,
  children?: React.ReactNode,
  className?: string
): JSX.Element;
```

### 파라미터

<Interface
  name="as"
  type="T"
  description="렌더링할 HTML 태그예요. 기본값은 <code>div</code>예요."
/>

<Interface
  name="rootMargin"
  type="string"
  description="감지 영역을 조정하는 마진이에요."
/>

<Interface
  name="areaThreshold"
  type="number"
  description="요소가 보여야 하는 최소 비율(0~1)이에요."
/>

<Interface
  name="timeThresholdMs"
  type="number"
  description="요소가 보여야 하는 최소 시간(밀리초)이에요."
/>

<Interface
  name="onImpressionStart"
  type="() => void"
  description="요소가 뷰포트에 들어올 때 실행되는 콜백 함수예요."
/>

<Interface
  name="onImpressionEnd"
  type="() => void"
  description="요소가 뷰포트에서 나갈 때 실행되는 콜백 함수예요."
/>

<Interface
  name="ref"
  type="Ref<Element<T>>"
  description="요소의 참조예요."
/>

<Interface
  name="children"
  type="React.ReactNode"
  description="컴포넌트 안에 렌더링할 자식 요소예요."
/>

<Interface
  name="className"
  type="string"
  description="스타일링에 쓸 추가 클래스 이름이에요."
/>

### 반환 값

<Interface
  name=""
  type="JSX.Element"
  description="자식 요소의 가시성을 추적하는 React 컴포넌트예요."
/>

## 예시

```tsx
function App() {
  return (
    <ImpressionArea
      onImpressionStart={() => console.log('요소가 보여요')}
      onImpressionEnd={() => console.log('요소가 사라졌어요')}
      timeThresholdMs={1000}
      areaThreshold={0.5}
    >
      <div>저를 추적해 보세요!</div>
    </ImpressionArea>
  );
}
```
