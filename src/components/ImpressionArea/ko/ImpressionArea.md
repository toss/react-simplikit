# ImpressionArea

`ImpressionArea`는 특정 DOM 요소가 화면에 보이는 시간을 측정하고, 그 요소가 뷰포트 안으로 들어오거나 나갈 때 콜백을 실행하는 컴포넌트입니다. 이 컴포넌트는 `useImpressionRef` 훅을 사용하여 요소의 가시성을 추적합니다.

## 인터페이스
```ts
function ImpressionArea(props: Object): JSX.Element;

```

### 파라미터

<Interface
  required
  name="props"
  type="Object"
  description="이 컴포넌트의 props입니다."
  :nested="[
    {
      name: 'props.as',
      type: 'ElementType',
      defaultValue: '\'div\'',
      description: '<code>div</code>가 기본값인 렌더링할 HTML 태그요.',
    },
    {
      name: 'props.rootMargin',
      type: 'string',
      description: '감지 영역을 조정하기 위한 여백이요.',
    },
    {
      name: 'props.areaThreshold',
      type: 'number',
      description:
        '요소의 가시성이 최소 몇 퍼센트가 되어야 하는지 설정 (0에서 1까지)이요.',
    },
    {
      name: 'props.timeThreshold',
      type: 'number',
      description:
        '요소가 최소 몇 밀리초 동안 보여야 하는지를 설정해요.',
    },
    {
      name: 'props.onImpressionStart',
      type: '() => void',
      description:
        '요소가 뷰에 들어갈 때 실행되는 콜백 함수요.',
    },
    {
      name: 'props.onImpressionEnd',
      type: '() => void',
      description:
        '요소가 뷰에서 나갈 때 실행되는 콜백 함수요.',
    },
    {
      name: 'props.ref',
      type: 'Ref<HTMLElement>',
      description: '요소에 대한 레퍼런스요.',
    },
    {
      name: 'props.children',
      type: 'React.ReactNode',
      description: '컴포넌트 내에 렌더링될 자식 요소들이요.',
    },
    {
      name: 'props.className',
      type: 'string',
      description: '스타일링을 위한 추가 클래스 이름들이요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="JSX.Element"
  description="자식 요소들의 가시성을 추적하는 React 컴포넌트입니다."
/>


## 예시

```tsx
function App() {
  return (
    <ImpressionArea
      onImpressionStart={() => console.log('요소가 뷰에 들어왔습니다')}
      onImpressionEnd={() => console.log('요소가 뷰에서 나갔습니다')}
      timeThreshold={1000}
      areaThreshold={0.5}
    >
      <div>저를 추적하세요!</div>
    </ImpressionArea>
  );
}
```
  
