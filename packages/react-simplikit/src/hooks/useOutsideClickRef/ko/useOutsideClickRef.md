# useOutsideClickRef

`useOutsideClickRef`는 콜백 ref를 반환하고, ref를 연결한 모든 요소의 외부에서 클릭이 발생하면 `onOutsideClick`을 호출하는 리액트 훅이에요. 트리거와 메뉴, 포털 콘텐츠에 같은 ref를 연결하면 되고, 내부에서 누르기 시작해 외부에서 뗀 경우는 외부 클릭으로 취급하지 않아요.

## 인터페이스

```ts
function useOutsideClickRef(options: Object): (element: Element | null) => void;
```

### 파라미터

<Interface
  required
  name="options"
  type="Object"
  description="외부 클릭을 감지하기 위한 옵션이에요."
  :nested="[
    {
      name: 'options.onOutsideClick',
      type: '() => void',
      required: true,
      description:
        'ref를 연결한 모든 요소의 외부에서 클릭이 발생하면 실행되는 함수예요. 클릭한 요소의 <code>onClick</code>보다 먼저 실행돼요.',
    },
    {
      name: 'options.enabled',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '외부 클릭을 감지할지 여부예요. <code>false</code>인 동안에는 <code>onOutsideClick</code>이 호출되지 않아요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="(element: Element | null) => void"
  description="내부로 취급할 각 요소의 <code>ref</code> 속성에 전달할 콜백 ref예요. 다시 렌더링되어도 같은 참조를 유지해요."
/>

## 예시

```tsx
import { useOutsideClickRef } from 'react-simplikit';
import { useState } from 'react';

function Dropdown({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClickRef({
    enabled: open,
    onOutsideClick: () => {
      setOpen(false);
      onClose();
    },
  });

  return (
    <>
      <button ref={ref} onClick={() => setOpen(prev => !prev)}>
        Menu
      </button>
      {open && <ul ref={ref}>...</ul>}
    </>
  );
}
```
