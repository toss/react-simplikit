# useOutsideClickEffect

`useOutsideClickEffect`는 지정한 컨테이너 외부에서 클릭 이벤트가 발생하면 콜백을 실행하는 리액트 훅이에요. 외부를 클릭했을 때 모달, 드롭다운, 툴팁 같은 UI 컴포넌트를 닫는 데 유용해요.

## 인터페이스

```ts
function useOutsideClickEffect(
  container: HTMLElement | (HTMLElement | null)[] | null,
  callback: () => void
): void;
```

### 파라미터

<Interface
  required
  name="container"
  type="HTMLElement | (HTMLElement | null)[] | null"
  description="단일 HTML 요소, HTML 요소나 <code>null</code>을 담은 배열 또는 <code>null</code>이에요. 배열의 <code>null</code>은 무시돼요. HTML 요소가 하나도 남지 않으면 콜백이 실행되지 않아요."
/>

<Interface
  required
  name="callback"
  type="() => void"
  description="지정한 컨테이너 외부를 클릭할 때 실행할 함수예요."
/>

### 반환 값

이 함수는 아무것도 반환하지 않아요.

## 예시

```tsx
import { useOutsideClickEffect } from 'react-simplikit';
import { useState } from 'react';

function Example() {
  const [wrapperEl, setWrapperEl] = useState<HTMLDivElement | null>(null);

  useOutsideClickEffect(wrapperEl, () => {
    console.log('외부 클릭했어요!');
  });

  return <div ref={setWrapperEl}>내용</div>;
}
```
