# usePreservedReference

`usePreservedReference`는 React에서 값이 변경되지 않았다면 기존 참조를 유지하고, 최신 상태를 안전하게 사용할 수 있도록 도와주는 React 훅이에요. 불필요한 렌더링을 방지하면서도 항상 최신 데이터를 사용할 수 있도록 해줘요.

## 인터페이스

```typescript
function usePreservedReference<T>(value: T, areValuesEqual?: (a: T, b: T) => boolean): T;
```

### 매개변수

- `value`: 참조를 유지할 값이에요. 상태 값이 변경될 때마다 비교 후 필요하면 새로운 참조를 반환해요.
- `areValuesEqual`: 두 값이 같은지 판단하는 선택적 함수예요. 기본적으로 `JSON.stringify`를 사용해 비교해요.

### 반환값

value가 이전 값과 같다면 동일한 참조를 반환하고, 다르다면 새로운 참조를 반환해요.

## 사용 예시

### 기본 사용

아래는 객체에 대한 참조를 유지하기 위해 훅을 사용하는 예제예요.

```tsx
import { usePreservedReference } from 'reactive-kit';
import { useState } from 'react';

function ExampleComponent() {
  const [state, setState] = useState({ key: 'value' });

  const preservedState = usePreservedReference(state);

  return <div>{preservedState.key}</div>;
}
```

### 사용자 정의 비교 함수

사용자 정의 비교 함수를 사용하는 방법을 보여주는 예제예요.

```tsx
import { usePreservedReference } from 'reactive-kit';
import { useState } from 'react';

function ExampleComponent() {
  const [state, setState] = useState({ key: 'value' });

  const preservedState = usePreservedReference(state, (a, b) => a.key === b.key);

  return <div>{preservedState.key}</div>;
}
```
