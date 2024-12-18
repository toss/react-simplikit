# useCombinedRefs

`useCombinedRefs`는 여러 개의 `ref`를 하나로 결합해서 관리할 수 있는 React 훅이에요. 결합된 `ref`가 업데이트되면, 전달된 모든 `ref`도 자동으로 업데이트돼요.

## 인터페이스

```ts
function useCombinedRefs<T>(...refs: Array<React.Ref<T> | ((instance: T | null) => void)>): React.Ref<T>;
```

### 매개변수

- ...refs: 결합할 여러 개의 ref를 배열로 전달해요. 각 ref는 다음 중 하나일 수 있어요:
  - React.Ref<T>: React에서 제공하는 ref 객체나 값이에요.
  - CallbackRef<T>: ref 업데이트 시 호출되는 콜백 함수예요.

### 반환 값

모든 전달된 ref를 업데이트할 수 있는 결합된 ref를 반환해요.

## 예시

```tsx
import { forwardRef, useRef } from 'react';
import { useCombinedRefs } from '@tossteam/react';

// `forwardRef`로 부모 컴포넌트에서 전달받은 ref와 로컬 ref를 결합
const Component = forwardRef((props, parentRef) => {
  // 로컬 ref 생성
  const localRef = useRef(null);

  // 로컬 ref와 부모에서 받은 ref를 결합
  const combinedRef = useCombinedRefs(localRef, parentRef);

  return <div ref={combinedRef}>안녕하세요</div>;
});
```

1. useCombinedRefs는 여러 개의 ref를 받아요.
2. 반환된 결합된 ref가 업데이트되면, 제공된 모든 ref가 동일한 값으로 업데이트돼요.
3. 이를 통해 부모와 자식에서 하나의 ref를 공유하고 관리할 수 있어요.
