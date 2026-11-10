# useDoubleClick

`useDoubleClick`는 단일 클릭과 더블 클릭 이벤트를 구분하는 리액트 훅이에요. 포인터 클릭이면 단일 클릭 콜백을 지정한 시간만큼 늦게 실행하고, 그 시간 안에 두 번째 클릭(더블 클릭)이 발생하면 단일 클릭 콜백 실행을 취소해요. 클릭 횟수 정보가 없는 클릭(`event.detail === 0`, 예: 키보드로 버튼을 누른 경우)은 더블 클릭이 될 수 없으므로 `click`을 바로 실행하고 `doubleClick`은 호출하지 않아요.

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
  description="클릭 처리 방식을 설정하는 옵션이에요."
  :nested="[
    {
      name: 'props.delay',
      type: 'number',
      required: false,
      defaultValue: '250',
      description:
        '포인터로 단일 클릭했을 때 <code>click</code>을 실행하기 전에 두 번째 클릭을 기다리는 시간(밀리초)이에요. 클릭 횟수 정보가 없는 클릭(<code>event.detail === 0</code>)은 <code>click</code>을 바로 실행하고 <code>delay</code>를 무시해요. 기본값은 250ms예요.',
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
        '더블 클릭 시 실행되는 콜백 함수예요. 반드시 전달해야 해요.',
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
