# usePreservedCallback

`usePreservedCallback`은 React 컴포넌트가 마운트되어 있는 동안 특정 콜백 함수의 참조를 보존하는 훅이에요. 콜백 로직이 변경되지 않는 한, 반환된 콜백의 참조가 안정적으로 유지돼요. 이를 통해 불필요한 렌더링이나 의존성 배열 관리의 복잡성을 줄일 수 있어요.

## 인터페이스

```ts
function usePreservedCallback<Callback extends (...args: any[]) => any>(callback: Callback): Callback;
```

### 매개변수

- `callback`: 참조를 보존할 콜백 함수예요. 이 함수는 컴포넌트가 마운트되는 동안 동일한 참조를 유지해요.

### 반환 값

전달받은 `callback`과 동일한 타입의 보존된 콜백을 반환해요. 반환된 콜백은 참조가 고정되며, 컴포넌트가 리렌더링되더라도 새로운 함수로 재생성되지 않아요.

## 예시

```tsx
import { usePreservedCallback } from '@tossteam/react';

function Component() {
  // 콜백 함수 생성 및 보존
  const preservedCallback = usePreservedCallback(() => {
    console.log('콜백이 보존되었습니다');
  });

  return <button onClick={preservedCallback}>클릭</button>;
}
```

- usePreservedCallback은 전달된 콜백 함수가 변경되지 않는 한 동일한 참조를 반환해요.
- 내부적으로 React.useCallback과 유사하게 동작하지만, 의존성 배열을 명시하지 않아도 안정적인 참조를 보장해요.
