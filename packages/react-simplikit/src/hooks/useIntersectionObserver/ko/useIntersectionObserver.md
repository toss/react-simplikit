# useIntersectionObserver

`useIntersectionObserver`는 특정 DOM 요소가 화면에 보이는지를 감지하는 커스텀 훅이에요. 이 훅은 `IntersectionObserver` API를 사용하여 요소가 뷰포트에 들어오거나 나갈 때 콜백을 실행해요.

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
  description="요소의 가시성이 변경될 때 실행되는 콜백 함수예요. <code>entry.isIntersecting</code>를 확인하여 요소가 보이는지를 판단할 수 있어요."
/>

<Interface
  required
  name="options"
  type="IntersectionObserverInit"
  description="<code>IntersectionObserver</code>에 대한 옵션이에요."
  :nested="[
    {
      name: 'options.root',
      type: 'Element | Document | null',
      required: false,
      description: '대상의 가시성을 판단할 때 뷰포트로 사용할 요소예요.',
    },
    {
      name: 'options.rootMargin',
      type: 'string',
      required: false,
      description: 'root 주위의 마진이에요.',
    },
    {
      name: 'options.threshold',
      type: 'number | number[]',
      required: false,
      description:
        '대상이 몇 퍼센트 보일 때 콜백을 실행할지 나타내는 숫자 하나 또는 숫자 배열이에요.',
    },
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
        console.log('Element is in view:', entry.target);
      } else {
        console.log('Element is out of view:', entry.target);
      }
    },
    { threshold: 0.5 }
  );

  return <div ref={ref}>나를 관찰해요!</div>;
}
```
