# useVisibilityEvent

`useVisibilityEvent`는 문서의 가시성 상태 변화에 귀를 기울이고 콜백을 호출하는 리액트 훅이에요.

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
  description="가시성 상태가 변할 때 호출되는 함수예요. 현재 가시성 상태('visible' 또는 'hidden')를 인수로 받아요."
/>

<Interface
  name="options"
  type="object"
  description="훅에 대한 선택적 설정이에요."
  :nested="[
    {
      name: 'options.immediate',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        '만약 true이면, 마운트 시 현재 가시성 상태로 콜백이 즉시 호출돼요.',
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
    console.log(`문서가 이제 ${visibilityState} 상태예요`);
  });

  return <p>가시성 변화는 콘솔에서 확인하세요.</p>;
}
```
