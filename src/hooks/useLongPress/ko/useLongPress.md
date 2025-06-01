# useLongPress

`useLongPress`는 사용자가 요소를 지정된 시간 동안 눌렀을 때를 감지하는 리액트 훅이에요. 이 훅은 마우스와 터치 이벤트를 모두 처리하여 데스크톱과 모바일 장치에서 일관되게 작동해요.

## 인터페이스

```ts
function useLongPress<E extends HTMLElement>(
  onLongPress: (event: React.MouseEvent<E> | React.TouchEvent<E>) => void,
  options: Object
): Object;
```

### 파라미터

<Interface
  required
  name="onLongPress"
  type="(event: React.MouseEvent<E> | React.TouchEvent<E>) => void"
  description="롱 프레스가 감지되었을 때 실행되는 콜백 함수예요."
/>

<Interface
  name="options"
  type="Object"
  description="롱 프레스 동작을 설정하는 옵션이에요."
  :nested="[
    {
      name: 'options.delay',
      type: 'number',
      required: false,
      defaultValue: '500',
      description:
        '롱 프레스를 트리거하기 전에 걸리는 시간이에요. 디폴트값은 500ms예요.',
    },
    {
      name: 'options.moveThreshold',
      type: 'Object',
      required: false,
      description: '롱 프레스를 취소하기 전에 허용되는 최대 움직임이에요.',
    },
    {
      name: 'options.moveThreshold.x',
      type: 'number',
      required: false,
      description: '최대 수평 움직임(픽셀 단위)이에요.',
    },
    {
      name: 'options.moveThreshold.y',
      type: 'number',
      required: false,
      description: '최대 수직 움직임(픽셀 단위)이에요.',
    },
    {
      name: 'options.onClick',
      type: '(event) => void',
      required: false,
      description:
        '일반 클릭(딜레이 전에 누르고 떼는) 시 실행할 선택적 함수예요.',
    },
    {
      name: 'options.onLongPressEnd',
      type: '(event) => void',
      required: false,
      description: '롱 프레스가 끝날 때 실행할 선택적 함수예요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="Object"
  description="요소에 첨부할 핸들러들이에요."
/>

## 예시

```tsx
import { useLongPress } from 'react-simplikit';

function ContextMenu() {
  const [menuVisible, setMenuVisible] = useState(false);

  const longPressHandlers = useLongPress(() => setMenuVisible(true), {
    delay: 400,
    onClick: () => console.log('일반 클릭'),
    onLongPressEnd: () => console.log('롱 프레스 완료'),
  });

  return (
    <div>
      <button {...longPressHandlers}>길게 누르세요</button>
      {menuVisible && <div className="context-menu">컨텍스트 메뉴</div>}
    </div>
  );
}
```
