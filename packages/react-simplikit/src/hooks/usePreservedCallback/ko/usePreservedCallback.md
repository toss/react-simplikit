# usePreservedCallback

`usePreservedCallback`은 콜백 함수의 참조를 안정적으로 유지하면서도 항상 최신 상태나 props에 접근할 수 있게 해 주는 리액트 훅이에요. 불필요한 리렌더링을 방지하고, 자식 컴포넌트에 콜백을 전달하거나 이벤트 리스너를 처리할 때 의존성 관리를 단순하게 해 줘요.

## 인터페이스

```ts
function usePreservedCallback<
  Arguments extends any[] = any[],
  ReturnValue = unknown,
>(callback: (...args: any[]) => any): (...args: any[]) => any;
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
  description="입력 콜백과 시그니처가 같은 함수예요. 반환된 함수는 최신 상태나 props에 접근하면서 안정적인 참조를 유지해요."
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
