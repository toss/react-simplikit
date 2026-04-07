# useVisibilityEvent

문서의 가시성 상태 변화를 감지하고 콜백을 실행하는 리액트 훅이에요.

## 인터페이스

```ts
function useVisibilityEvent(
  callback: (visibilityState: 'visible' | 'hidden') => void,
  options: object
): void;
```

### 파라미터

<Interface
  required
  name="callback"
  type="(visibilityState: 'visible' | 'hidden') => void"
  description="가시성 상태가 변할 때 호출되는 함수예요. 현재 가시성 상태('visible' 또는 'hidden')를 인자로 받아요."
/>

<Interface
  name="options"
  type="object"
  description="훅의 선택적 설정값이에요."
  :nested="[
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        'true이면, 현재 가시성 상태로 마운트 시에 즉시 콜백이 호출돼요.',
    },
  ]"
/>

### 반환 값

이 훅은 아무것도 반환하지 않아요.

## 예시

```tsx
import { useVisibilityEvent } from 'react-simplikit';

function Component() {
  useVisibilityEvent(visibilityState => {
    console.log(`Document is now ${visibilityState}`);
  });

  return <p>가시성 변화는 콘솔을 확인해 주세요.</p>;
}
```
