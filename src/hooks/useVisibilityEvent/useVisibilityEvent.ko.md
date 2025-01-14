# useVisibilityEvent

`useVisibilityEvent`는 문서의 가시성 상태 변경 이벤트를 감지하고, 이를 처리하는 데 도움을 주는 React 훅이에요.

## 인터페이스

```ts
function useVisibilityEvent(
  callback: (visibilityState: 'visible' | 'hidden') => void,
  options: { immediate?: boolean }
): void;
```

### 파라미터

- `callback ((visibilityState: 'visible' | 'hidden') => void`
  - 가시성 상태가 변경될 때 호출되는 콜백 함수예요.
  - `'visible' | 'hidden'` 값을 매개변수로 전달받아요.
- `options ({ immediate?: boolean })`
  - immediate (boolean)
    - true일 경우, 훅이 처음 마운트될 때 즉시 콜백을 실행해요.
    - 기본값은 false예요.

### 반환 값

이 훅은 반환값이 없어요.

## 예시

```tsx
import { useVisibilityEvent } from 'reactie';

function Component() {
  useVisibilityEvent(visibilityState => {
    console.log(`Document is now ${visibilityState}`);
  });

  return (
    <div>
      <p>Check the console for visibility changes.</p>
    </div>
  );
}
```
