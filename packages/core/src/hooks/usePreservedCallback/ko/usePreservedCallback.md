# usePreservedCallback

`usePreservedCallback`는 리액트 훅으로, 최신 상태나 props에 항상 접근할 수 있도록 하면서 콜백 함수에 대한 안정적인 참조를 유지해요. 이는 불필요한 리렌더링을 방지하고, 자식 컴포넌트에 콜백을 전달하거나 이벤트 리스너를 처리할 때의 의존성 관리를 단순화해요.

## 인터페이스

```ts
function usePreservedCallback(
  callback: (...args: any[]) => any
): (...args: any[]) => any;
```

### 파라미터

<Interface
  required
  name="callback"
  type="(...args: any[]) => any"
  description="유지할 함수예요. 컴포넌트가 리렌더링될 때도 항상 최신 상태나 props를 참조해요."
/>

### 반환 값

<Interface
  name=""
  type="(...args: any[]) => any"
  description="입력 콜백과 동일한 시그니처를 가지는 함수예요. 반환된 함수는 최신 상태나 props에 접근하면서 안정적인 참조를 유지해요."
/>

## 예시

```tsx
import { usePreservedCallback } from 'react-simplikit';
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = usePreservedCallback(() => {
    console.log(`현재 카운트: ${count}`);
    setCount(prev => prev + 1);
  });

  return <button onClick={handleClick}>클릭하세요</button>;
}
```
