# ImpressionArea

`ImpressionArea`는 특정 DOM 요소가 화면에 보이는 시간을 측정하고 요소가 뷰포트에 들어가거나 나갈 때 콜백을 실행하는 컴포넌트거든요. 이 컴포넌트는 요소의 가시성을 추적하기 위해 `useImpressionRef` 훅을 사용해요.

## Interface
```ts
function ImpressionArea(props: Object): JSX.Element;

```

### Parameters

<Interface
  required
  name="props"
  type="Object"
  description="컴포넌트를 위한 props에요."
  :nested="[
    {
      name: 'props.as',
      type: 'ElementType',
      defaultValue: '\'div\'',
      description: '렌더링할 HTML 태그에요. 기본값은 <code>div</code>이에요.',
    },
    {
      name: 'props.rootMargin',
      type: 'string',
      description: '검출 영역을 조정하기 위한 마진이에요.',
    },
    {
      name: 'props.areaThreshold',
      type: 'number',
      description:
        '요소가 보여져야하는 최소 비율이에요 (0에서 1 사이).',
    },
    {
      name: 'props.timeThreshold',
      type: 'number',
      description:
        '요소가 보여져야하는 최소 시간이에요 (밀리초 단위).',
    },
    {
      name: 'props.onImpressionStart',
      type: '() => void',
      description:
        '요소가 시야에 들어갈 때 실행되는 콜백 함수에요.',
    },
    {
      name: 'props.onImpressionEnd',
      type: '() => void',
      description:
        '요소가 시야에서 나갈 때 실행되는 콜백 함수에요.',
    },
    {
      name: 'props.ref',
      type: 'Ref<HTMLElement>',
      description: '요소에 대한 참조에요.',
    },
    {
      name: 'props.children',
      type: 'React.ReactNode',
      description: '컴포넌트 안에서 렌더링될 자식 요소들에요.',
    },
    {
      name: 'props.className',
      type: 'string',
      description: '스타일링을 위한 추가 클래스 이름이에요.',
    },
  ]"
/>

### Return Value

<Interface
  name=""
  type="JSX.Element"
  description="자식 요소들의 가시성을 추적하는 React 컴포넌트에요."
/>


## Example

```tsx
import { ImpressionArea } from 'react-simplikit';

function App() {
  return (
    <ImpressionArea
      onImpressionStart={() => console.log('요소가 시야에 들어갔어요')}
      onImpressionEnd={() => console.log('요소가 시야에서 나갔어요')}
      timeThreshold={1000}
      areaThreshold={0.5}
    >
      <div>제 가시성을 추적해보세요!</div>
    </ImpressionArea>
  );
}
```
  
