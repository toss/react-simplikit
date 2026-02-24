# useLongPress

`useLongPress`는 요소가 지정된 기간 동안 눌려지고 유지될 때를 감지하는 리액트 훅이에요. 마우스와 터치 이벤트를 모두 처리하여 데스크탑과 모바일 장치에서 일관되게 작동해요.

## Interface

```ts
function useLongPress<E extends HTMLElement>(
  onLongPress: (event: React.MouseEvent<E> | React.TouchEvent<E>) => void,
  options: UseLongPressOptions
): Object;
```

### 파라미터

<Interface
  required
  name="onLongPress"
  type="(event: React.MouseEvent<E> | React.TouchEvent<E>) => void"
  description="길게 누름이 감지되었을 때 실행될 콜백 함수예요."
/>

<Interface
  name="options"
  type="UseLongPressOptions"
  description="길게 누름 동작을 위한 설정 옵션이에요."
  :nested="[
    {
      name: 'options.delay',
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
      type: '(event) => void',
      required: false,
      description:
        '일반 클릭(지연 전에 눌렀다 놓기) 시 실행할 선택적 함수예요.',
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
  description="요소에 첨부할 핸들러들을 제공해요."
  :nested="[
    {
      name: 'onMouseDown',
      type: '(event: MouseEvent<E> | TouchEvent<E>) => void',
      required: false,
      description:
        '마우스 다운 이벤트에 대한 이벤트 핸들러예요. - onMouseUp <code>(event<br />  : MouseEvent<E> | TouchEvent<E>) => void</code> - 마우스 업 이벤트에 대한 이벤트 핸들러예요. - onMouseLeave <code>(event<br />  : MouseEvent<E> | TouchEvent<E>) => void</code> - 마우스 리브 이벤트에 대한 이벤트 핸들러예요. - onTouchStart <code>(event<br />  : MouseEvent<E> | TouchEvent<E>) => void</code> - 터치 시작 이벤트에 대한 이벤트 핸들러예요. - onTouchEnd <code>(event<br />  : MouseEvent<E> | TouchEvent<E>) => void</code> - 터치 종료 이벤트에 대한 이벤트 핸들러예요. - onMouseMove <code>(event<br />  : MouseEvent<E> | TouchEvent<E>) => void</code> - 마우스 이동 이벤트에 대한 이벤트 핸들러예요. 만약 <code>moveThreshold</code>가 제공되면 포함돼요. - onTouchMove <code>(event<br />  : MouseEvent<E> | TouchEvent<E>) => void</code> - 터치 이동 이벤트에 대한 이벤트 핸들러예요. 만약 <code>moveThreshold</code>가 제공되면 포함돼요.',
    },
  ]"
/>

## 예시

```tsx
import { useLongPress } from 'react-simplikit';

function ContextMenu() {
  const [menuVisible, setMenuVisible] = useState(false);

  const longPressHandlers = useLongPress(() => setMenuVisible(true), {
    delay: 400,
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
