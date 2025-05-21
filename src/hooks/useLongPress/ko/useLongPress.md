# useLongPress

`useLongPress`는 요소가 지정된 시간 동안 눌리고 유지되는 것을 감지하는 리액트 훅이에요. 마우스와 터치 이벤트를 모두 처리하여 데스크톱과 모바일 기기에서 일관되게 작동해요.

## 인터페이스

```ts
function useLongPress<E extends HTMLElement>(
  onLongPress: (event: React.MouseEvent<E> | React.TouchEvent<E>) => void,
  options: UseOptionsObject
): Object;
```

### 파라미터

<Interface
  required
  name="onLongPress"
  type="(event: React.MouseEvent<E> | React.TouchEvent<E>) => void"
  description="길게 누르기가 감지될 때 실행되는 콜백 함수예요."
/>
<Interface
  name="options"
  type="Object"
  description="길게 누르기 동작을 설정하는 옵션이에요."
  :nested="[
    {
      name: 'options.delay',
      type: 'number',
      required: false,
      defaultValue: '500',
      description: '길게 누르기를 트리거하기 전 시간(밀리초)이에요. 기본값은 500ms예요.'
    },
    {
      name: 'options.moveThreshold',
      type: 'Object',
      required: false,
      description: '길게 누르기를 취소하기 전에 허용되는 최대 이동 거리예요.'
    },
    {
      name: 'options.moveThreshold.x',
      type: 'number',
      required: false,
      description: '최대 수평 이동 거리(픽셀)예요.'
    },
    {
      name: 'options.moveThreshold.y',
      type: 'number',
      required: false,
      description: '최대 수직 이동 거리(픽셀)예요.'
    },
    {
      name: 'options.onClick',
      type: '(event) => void',
      required: false,
      description: '일반 클릭(지연 시간 전에 누르고 떼기)에 실행되는 선택적 함수예요.'
    },
    {
      name: 'options.onLongPressEnd',
      type: '(event) => void',
      required: false,
      description: '길게 누르기가 끝날 때 실행되는 선택적 함수예요.'
    }
    ]"
/>

### 반환 값

<Interface
  name=""
  type="Object"
  description="JSX 요소에 전달할 이벤트 핸들러가 포함된 객체예요."
  :nested="[
    {
      name: 'onMouseDown',
      type: 'function',
      description: '마우스 다운 이벤트 핸들러예요.'
    },
    {
      name: 'onMouseUp',
      type: 'function',
      description: '마우스 업 이벤트 핸들러예요.'
    },
    {
      name: 'onMouseLeave',
      type: 'function',
      description: '마우스 리브 이벤트 핸들러예요.'
    },
    {
      name: 'onTouchStart',
      type: 'function',
      description: '터치 시작 이벤트 핸들러예요.'
    },
    {
      name: 'onTouchEnd',
      type: 'function',
      description: '터치 종료 이벤트 핸들러예요.'
    },
    {
      name: 'onTouchMove',
      type: 'function',
      description: '터치 이동 이벤트 핸들러예요 (moveThreshold가 지정된 경우에만 포함).'
    },
    {
      name: 'onMouseMove',
      type: 'function',
      description: '마우스 이동 이벤트 핸들러예요 (moveThreshold가 지정된 경우에만 포함).'
    }
    ]"
/>

## 예시

```tsx
import { useLongPress } from 'react-simplikit';
import { useState } from 'react';

function ContextMenu() {
  const [menuVisible, setMenuVisible] = useState(false);

  const longPressHandlers = useLongPress(() => setMenuVisible(true), {
    delay: 400,
    onClick: () => console.log('일반 클릭'),
    onLongPressEnd: () => console.log('길게 누르기 완료'),
  });

  return (
    <div>
      <button {...longPressHandlers}>길게 누르세요</button>
      {menuVisible && <div className="context-menu">컨텍스트 메뉴</div>}
    </div>
  );
}
```
