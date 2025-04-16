# useOutsideClickEffect

`useOutsideClickEffect`는 지정된 컨테이너 외부에서 클릭 이벤트가 발생할 때 콜백을 트리거하는 리액트 훅이에요. 모달, 드롭다운, 툴팁 및 다른 UI 컴포넌트를 외부 클릭 시 닫는 데 유용해요.

## 인터페이스

```ts
function useOutsideClickEffect(
  container: HTMLElement | HTMLElement[] | null,
  callback: () => void
): void;
```

### 파라미터

<Interface
  required
  name="container"
  type="HTMLElement | HTMLElement[] | null"
  description="단일 HTML 요소, HTML 요소 배열 또는 <code>null</code>이에요. <code>null</code>인 경우, 이벤트 리스너가 연결되지 않아요."
/>

<Interface
  required
  name="callback"
  type="() => void"
  description="지정된 컨테이너 외부를 클릭할 때 실행되는 함수예요."
/>

### 반환 값

이 훅은 아무것도 반환하지 않아요.

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
