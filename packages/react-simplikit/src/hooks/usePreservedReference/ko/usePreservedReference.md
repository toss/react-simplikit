# usePreservedReference

`usePreservedReference`는 값이 변경되지 않았을 때 그 참조를 유지하면서 최신 상태를 안전하게 사용할 수 있도록 도와주는 리액트 훅이에요. 불필요한 리렌더링을 방지하면서도 항상 최신 데이터에 접근할 수 있게 해 줘요.

## 인터페이스

```ts
function usePreservedReference<T extends NotNullishValue>(
  value: T,
  areValuesEqual?: (a: T, b: T) => boolean
): T;
```

### 파라미터

<Interface
  required
  name="value"
  type="T"
  description="참조를 유지할 값이에요. 비교 결과 상태 값이 바뀌었으면 새로운 참조를 반환해요."
/>

<Interface
  name="areValuesEqual"
  type="(a: T, b: T) => boolean"
  description="두 값이 같은지 판단하는 선택적 함수예요. 기본적으로는 <code>JSON.stringify</code>로 비교해요."
/>

### 반환 값

<Interface
  name=""
  type="T"
  description="값이 이전 값과 같다고 판단되면 같은 참조를 반환하고, 그렇지 않으면 새로운 참조를 반환해요."
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

```tsx
import { usePreservedReference } from 'react-simplikit';
import { useState } from 'react';

function ExampleComponent() {
  const [state, setState] = useState({ key: 'value' });

  const preservedState = usePreservedReference(
    state,
    (a, b) => a.key === b.key
  );

  return <div>{preservedState.key}</div>;
}
```
