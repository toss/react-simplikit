# usePreservedReference

`usePreservedReference`는 값이 변경되지 않았을 때 참조를 유지하면서, 최신 상태를 안전하게 사용할 수 있도록 돕는 리액트 훅이에요. 불필요한 재렌더링을 방지하면서 항상 최신 데이터에 접근할 수 있도록 해줘요.

## 인터페이스

```ts
function usePreservedReference(value: T, areValuesEqual: (a: T, b: T) => boolean): T;
```

### 파라미터

<Interface
  required
  name="value"
  type="T"
  description="참조를 유지할 값이에요. 상태 값이 비교 후 변경되면 새로운 참조를 반환해요."
/>

<Interface
  name="areValuesEqual"
  type="(a: T, b: T) => boolean"
  description="두 값이 같은지 여부를 결정하는 선택적 함수예요. 기본적으로 <code>JSON.stringify</code>를 사용하여 비교해요."
/>

### 반환 값

<Interface
  name=""
  type="T"
  description="값이 이전 것과 같다고 간주되면 동일한 참조를, 그렇지 않으면 새로운 참조를 반환해요."
/>

## 예시

```tsx
import { usePreservedReference } from 'react-simplikit';
import { useState } from 'react';

function ExampleComponent() {
  const [state, setState] = useState({ key: 'value' });

  const preservedState = usePreservedReference(state);

  return <div>{preservedState.key}</div>;
}
```
