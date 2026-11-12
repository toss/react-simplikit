# useLongPress

`useLongPress`는 요소를 지정한 시간 동안 누르고 있는지 감지하는 리액트 훅이에요. 마우스 이벤트와 터치 이벤트를 모두 처리해서 데스크톱과 모바일 기기에서 일관되게 동작해요.

## 인터페이스

```ts
function useLongPress<E extends HTMLElement>(
  onLongPress: (event: React.MouseEvent<E> | React.TouchEvent<E>) => void,
  options?: UseLongPressOptions
): Object;
```

### 파라미터

<Interface
  required
  name="onLongPress"
  type="(event: React.MouseEvent<E> | React.TouchEvent<E>) => void"
  description="길게 누름을 감지하면 실행할 콜백 함수예요."
/>

<Interface
  name="options"
  type="UseLongPressOptions"
  description="길게 누름 동작을 설정하는 옵션이에요."
  :nested="[
    {
      name: 'options.delayMs',
      type: 'number',
      required: false,
      defaultValue: '500',
      description:
        '길게 누름으로 판단하기까지 기다리는 시간(ms)이에요. 기본값은 500ms예요.',
    },
    {
      name: 'options.moveThreshold',
      type: 'Object',
      required: false,
      description: '길게 누름이 취소되지 않고 움직일 수 있는 최대 거리예요.',
    },
    {
      name: 'options.moveThreshold.x',
      type: 'number',
      required: false,
      description: '최대 가로 이동 거리(px)예요.',
    },
    {
      name: 'options.moveThreshold.y',
      type: 'number',
      required: false,
      description: '최대 세로 이동 거리(px)예요.',
    },
    {
      name: 'options.onClick',
      type: '(event) => void',
      required: false,
      description:
        '일반 클릭(지연 시간이 지나기 전에 눌렀다 놓기)을 할 때 실행할 선택적 함수예요.',
    },
    {
      name: 'options.onLongPressEnd',
      type: '(event) => void',
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
      name: 'onMouseDown',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description: '마우스 다운 이벤트 핸들러예요.',
    },
    {
      name: 'onMouseUp',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description: '마우스 업 이벤트 핸들러예요.',
    },
    {
      name: 'onMouseLeave',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description: '마우스가 요소를 벗어날 때 실행하는 이벤트 핸들러예요.',
    },
    {
      name: 'onTouchStart',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description: '터치 시작 이벤트 핸들러예요.',
    },
    {
      name: 'onTouchEnd',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description: '터치 종료 이벤트 핸들러예요.',
    },
    {
      name: 'onMouseMove',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description:
        '마우스 이동 이벤트 핸들러예요. <code>moveThreshold</code>를 지정하면 포함돼요.',
    },
    {
      name: 'onTouchMove',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description:
        '터치 이동 이벤트 핸들러예요. <code>moveThreshold</code>를 지정하면 포함돼요.',
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
