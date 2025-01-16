# `usePreservedCallback`

`usePreservedCallback`은 React에서 콜백 함수의 참조를 유지하면서 최신 상태를 안전하게 사용할 수 있도록 도와주는 훅이에요. 컴포넌트가 재렌더링되더라도 콜백 참조는 변하지 않으면서 최신 상태를 사용할 수 있어요. 이를 통해 불필요한 렌더링을 방지하고, 상태 의존성을 따로 관리하지 않아도 돼요. 또한, `useCallback`보다 간단하게 사용할 수 있는 장점이 있어요.

## 인터페이스

```typescript
function usePreservedCallback<Argument = any, ReturnValue = unknown>(
  callback: (...args: Argument[]) => ReturnValue
): (...args: Argument[]) => ReturnValue;
```

### 매개변수

- **`callback`**  
  실행할 콜백 함수예요. 이 함수는 컴포넌트가 재렌더링되더라도 동일한 참조를 유지하면서 최신 상태를 참조해요.

### 반환값

- **콜백 함수와 동일한 형태의 함수**  
  반환된 함수는 최신 상태를 사용하며, 동일한 참조를 유지해 불필요한 렌더링을 방지할 수 있어요.

## 사용 예시

### 기본 사용

아래는 버튼을 클릭할 때마다 `count`를 증가시키는 간단한 예제예요.

```tsx
import { usePreservedCallback } from 'reactive-kit';
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  // `count`의 최신 값을 안전하게 참조하는 콜백 생성
  const handleClick = usePreservedCallback(() => {
    console.log(`Current count: ${count}`);
    setCount(count + 1);
  });

  return <button onClick={handleClick}>Click me</button>;
}
```

### 부모-자식 간 콜백 전달

부모 컴포넌트에서 자식 컴포넌트로 콜백을 전달할 때도 동일한 참조를 유지할 수 있어요.

```tsx
import { usePreservedCallback } from 'reactive-kit';
import { useState } from 'react';

function Parent() {
  const [count, setCount] = useState(0);

  // `setCount`의 최신 값을 사용하는 콜백 생성
  const increment = usePreservedCallback(() => {
    setCount(prev => prev + 1);
  });

  return <Child onIncrement={increment} />;
}

function Child({ onIncrement }: { onIncrement: () => void }) {
  return <button onClick={onIncrement}>Increment</button>;
}
```
