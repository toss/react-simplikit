# ImpressionArea

`ImpressionArea`는 특정 DOM 요소가 화면에 보이는 시간을 측정하고 요소가 뷰포트에 들어오거나 나갈 때 콜백을 실행하는 컴포넌트예요. 이 컴포넌트는 요소의 가시성을 추적하기 위해 `useImpressionRef` 훅을 사용해요.

## 인터페이스

```ts
function ImpressionArea(
  as: ElementType = 'div',
  rootMargin: string,
  areaThreshold: number,
  timeThreshold: number,
  onImpressionStart: () => void,
  onImpressionEnd: () => void,
  ref: Ref<HTMLElement>,
  children: React.ReactNode,
  className: string
): JSX.Element;
```

### 파라미터

<Interface
  name="as"
  type="ElementType"
  description="렌더링할 HTML 태그예요. 기본값은 <code>div</code>이에요."
/>

<Interface
  name="rootMargin"
  type="string"
  description="감지 영역을 조정하기 위한 마진이에요."
/>

<Interface
  name="areaThreshold"
  type="number"
  description="요소가 보여야 하는 최소 비율이에요 (0에서 1)."
/>

<Interface
  name="timeThreshold"
  type="number"
  description="요소가 보여야 하는 최소 시간(밀리초)이에요."
/>

<Interface
  name="onImpressionStart"
  type="() => void"
  description="요소가 뷰에 들어갈 때 실행되는 콜백 함수예요."
/>

<Interface
  name="onImpressionEnd"
  type="() => void"
  description="요소가 뷰에서 나갈 때 실행되는 콜백 함수예요."
/>

<Interface
  name="ref"
  type="Ref<HTMLElement>"
  description="요소에 대한 참조예요."
/>

<Interface
  name="children"
  type="React.ReactNode"
  description="컴포넌트 내부에 렌더링될 자식 요소들이에요."
/>

<Interface
  name="className"
  type="string"
  description="스타일링을 위한 추가 클래스 이름들이에요."
/>

### 반환 값

<Interface
  name=""
  type="JSX.Element"
  description="자식 요소들의 가시성을 추적하는 React 컴포넌트예요."
/>

## 예시

```tsx
function App() {
  return (
    <ImpressionArea
      onImpressionStart={() => console.log('요소가 보여요')}
      onImpressionEnd={() => console.log('요소가 사라졌어요')}
      timeThreshold={1000}
      areaThreshold={0.5}
    >
      <div>저를 추적해 보세요!</div>
    </ImpressionArea>
  );
}
```
