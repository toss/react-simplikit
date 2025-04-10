# ImpressionArea

`ImpressionArea`는 특정 DOM 요소가 화면에 보이는 시간을 측정하고, 요소가 뷰포트에 들어오거나 나갈 때 콜백을 실행하는 컴포넌트예요. 이 컴포넌트는 `useImpressionRef` 훅을 사용하여 요소의 가시성을 추적해요.

## 인터페이스
```ts
function ImpressionArea(props: Object): JSX.Element;

```

### 파라미터

<Interface
  required
  name="props"
  type="Object"
  description="컴포넌트의 속성입니다."
  :nested="[
    {
      name: 'props.as',
      type: 'ElementType',
      defaultValue: '\'div\'',
      description: '렌더링할 HTML 태그예요. 기본값은 <code>div</code>이에요.',
    },
    {
      name: 'props.rootMargin',
      type: 'string',
      description: '감지 영역을 조정하는 여백이에요.',
    },
    {
      name: 'props.areaThreshold',
      type: 'number',
      description:
        '요소가 보여야 하는 최소 비율이에요 (0에서 1까지).',
    },
    {
      name: 'props.timeThreshold',
      type: 'number',
      description:
        '요소가 보여야 하는 최소 시간이에요 (밀리초 단위).',
    },
    {
      name: 'props.onImpressionStart',
      type: '() => void',
      description:
        '요소가 뷰포트에 들어올 때 실행되는 콜백 함수에요.',
    },
    {
      name: 'props.onImpressionEnd',
      type: '() => void',
      description:
        '요소가 뷰포트에서 나갈 때 실행되는 콜백 함수에요.',
    },
    {
      name: 'props.ref',
      type: 'Ref<HTMLElement>',
      description: '요소의 참조값이에요.',
    },
    {
      name: 'props.children',
      type: 'React.ReactNode',
      description: '컴포넌트 안에 렌더링될 자식 요소들이에요.',
    },
    {
      name: 'props.className',
      type: 'string',
      description: '스타일링을 위한 추가 클래스 이름이에요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="JSX.Element"
  description="자식 요소의 가시성을 추적하는 React 컴포넌트에요."
/>


## 예시

```tsx
function App() {
  return (
    <ImpressionArea
      onImpressionStart={() => console.log('Element entered view')}
      onImpressionEnd={() => console.log('Element exited view')}
      timeThreshold={1000}
      areaThreshold={0.5}
    >
      <div>Track me!</div>
    </ImpressionArea>
  );
}
```
  
