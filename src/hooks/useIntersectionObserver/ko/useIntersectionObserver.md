# useIntersectionObserver

`useIntersectionObserver`는 특정 DOM 요소가 화면에 보이는지 감지하는 리액트 훅이에요. 이 훅은 `IntersectionObserver` API를 사용하여 요소가 뷰포트에 들어오거나 나갈 때 콜백을 실행해요.

## 인터페이스

```ts
function useIntersectionObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit
): (element: Element | null) => void;
```

### 파라미터

<Interface
  required
  name="callback"
  type="(entry: IntersectionObserverEntry) => void"
  description="요소의 가시성이 변경될 때 실행되는 콜백 함수예요. <code>entry.isIntersecting</code>을 확인하여 요소가 보이는지 결정할 수 있어요."
/>

<Interface
required
name="options"
type="IntersectionObserverInit"
description="<code>IntersectionObserver</code>를 위한 옵션이에요."
:nested="[
{
name: 'options.root',
type: 'boolean',
required: false,
description: '대상의 가시성을 확인하기 위해 사용되는 뷰포트 역할을 하는 요소예요.'
},
{
name: 'options.rootMargin',
type: 'string',
required: false,
description: '루트 주변의 여백이에요.'
},
{
name: 'options.threshold',
type: 'number | number[]',
required: false,
description: "옵저버의 콜백이 실행되어야 하는 대상의 가시성에 대한 백분율이에요."
}
]"
/>

### 반환 값

<Interface
  name=""
  type="(element: Element | null) => void"
  description="요소를 설정하는 함수예요. 이 함수를 <code>ref</code> 속성에 첨부하면, 요소의 가시성이 변경될 때마다 <code>callback</code>이 실행돼요."
/>

## 예시

```tsx
import { useIntersectionObserver } from 'react-simplikit';

function Component() {
  const ref = useIntersectionObserver<HTMLDivElement>(
    entry => {
      if (entry.isIntersecting) {
        console.log('요소가 보이는 중이에요:', entry.target);
      } else {
        console.log('요소가 보이지 않아요:', entry.target);
      }
    },
    { threshold: 0.5 }
  );

  return <div ref={ref}>저를 관찰해 보세요!</div>;
}
```
