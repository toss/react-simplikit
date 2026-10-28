# useLongPress

`useLongPress`는 요소가 지정된 기간 동안 눌려지고 유지될 때를 감지하는 리액트 훅이에요.
포인터 이벤트를 수신하므로 마우스, 터치, 펜 누름은 하나의 스트림이고, 탭 뒤에 따라오는 에뮬레이트된 마우스 이벤트는 두 번째 누름을 시작하지 않아요.
`pointercancel`은 브라우저가 스크롤하려고 포인터를 가져가는 경우를 포함해 누름을 취소해요.
주 포인터가 아닌 포인터와 주 버튼이 아닌 버튼은 무시해요.

## 인터페이스

```ts
function useLongPress<E extends HTMLElement>(
  onLongPress: (event: React.PointerEvent<E>) => void,
  options?: UseLongPressOptions
): Object;
```

### 파라미터

<Interface
  required
  name="onLongPress"
  type="(event: React.PointerEvent<E>) => void"
  description="길게 누름이 감지되었을 때 실행될 콜백 함수예요."
/>

<Interface
  name="options"
  type="UseLongPressOptions"
  description="길게 누름 동작을 위한 설정 옵션이에요."
  :nested="[
    {
      name: 'options.delayMs',
      type: 'number',
      required: false,
      defaultValue: '500',
      description:
        '길게 누름을 시작하기 전에 대기할 밀리초(ms) 단위의 시간이에요. 기본값은 500ms예요.',
    },
    {
      name: 'options.moveThreshold',
      type: 'Object',
      required: false,
      description: '길게 누름을 취소하기 전에 허용되는 최대 움직임이에요.',
    },
    {
      name: 'options.moveThreshold.x',
      type: 'number',
      required: false,
      description: '최대 수평 움직임을 픽셀 단위로 설정해요.',
    },
    {
      name: 'options.moveThreshold.y',
      type: 'number',
      required: false,
      description: '최대 수직 움직임을 픽셀 단위로 설정해요.',
    },
    {
      name: 'options.onClick',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description:
        '일반 클릭(지연 전에 눌렀다 놓기) 시 실행할 선택적 함수예요.',
    },
    {
      name: 'options.onLongPressEnd',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description: '길게 누름이 끝났을 때 실행할 선택적 함수예요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="Object"
  description="요소에 연결할 이벤트 핸들러예요."
  :nested="[
    {
      name: 'onPointerDown',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description: '주 포인터의 주 버튼으로 누름을 시작해요.',
    },
    {
      name: 'onPointerUp',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description:
        '추적 중인 누름을 끝내요. 지연 전에 놓으면 <code>onClick</code>을 호출하고, 길게 누르기가 이미 발생했으면 <code>onLongPressEnd</code>를 호출해요.',
    },
    {
      name: 'onPointerLeave',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description:
        '포인터가 요소를 벗어나면 추적 중인 누름을 취소해요. <code>onClick</code>은 호출하지 않아요. 길게 누르기가 이미 발생했으면 <code>onLongPressEnd</code>를 호출해요.',
    },
    {
      name: 'onPointerCancel',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description:
        '브라우저가 포인터를 취소하면 추적 중인 누름을 취소해요. 예를 들어 스크롤이 시작될 때예요. <code>onClick</code>은 호출하지 않아요. 길게 누르기가 이미 발생했으면 <code>onLongPressEnd</code>를 호출해요.',
    },
    {
      name: 'onPointerMove',
      type: '(event: React.PointerEvent<E>) => void',
      required: false,
      description:
        '움직임이 <code>moveThreshold</code>를 넘으면 대기 중인 길게 누르기를 취소해요. <code>moveThreshold</code>가 제공되면 포함돼요.',
    },
  ]"
/>

## 예시

```tsx
import { useLongPress } from 'react-simplikit';

function ContextMenu() {
  const [menuVisible, setMenuVisible] = useState(false);

  const longPressHandlers = useLongPress(() => setMenuVisible(true), {
    delayMs: 400,
    onClick: () => console.log('일반 클릭'),
    onLongPressEnd: () => console.log('길게 누름 완료'),
  });

  return (
    <div>
      <button {...longPressHandlers}>눌러서 유지해보세요</button>
      {menuVisible && <div className="context-menu">컨텍스트 메뉴</div>}
    </div>
  );
}
```
