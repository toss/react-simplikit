# useDoubleClick

`useDoubleClick`는 단일 클릭과 더블 클릭 이벤트를 구분하는 리액트 훅이에요. 지정된 시간 동안 단일 클릭 콜백 실행을 지연시키고, 그 시간 안에 두 번째 클릭(즉, 더블 클릭)이 발생하면 이를 취소해요.

## 인터페이스

```ts
function useDoubleClick<E extends HTMLElement>(
  props: Object
): (event: MouseEvent<E>) => void;
```

### 파라미터

<Interface
  required
  name="props"
  type="Object"
  description="클릭 처리를 위한 설정 옵션이에요."
  :nested="[
    {
      name: 'props.delay',
      type: 'number',
      required: false,
      defaultValue: '250',
      description:
        '단일 클릭 콜백을 실행하기 전에 기다리는 밀리초 단위 수로, 기본값은 250ms예요.',
    },
    {
      name: 'props.click',
      type: '(event: MouseEvent<E>) => void',
      required: false,
      description: '단일 클릭 시 실행되는 콜백 함수예요.',
    },
    {
      name: 'props.doubleClick',
      type: '(event: MouseEvent<E>) => void',
      required: true,
      description:
        '더블 클릭 시 실행되는 콜백 함수로, 필수예요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="(event: MouseEvent<E>) => void"
  description="요소의 <code>onClick</code> 이벤트에 연결할 클릭 핸들러 함수예요."
/>

## 예시

```tsx
function GalleryCard() {
  const [selected, setSelected] = useState(false);

  const handleClick = () => setSelected(prev => !prev);
  const handleDoubleClick = () => alert('확대!');

  const handleEvent = useDoubleClick({
    click: handleClick,
    doubleClick: handleDoubleClick,
  });

  return <div onClick={handleEvent}>{selected ? '선택됨' : '선택 안됨'}</div>;
}
```
