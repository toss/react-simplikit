# mergeRefs

`mergeRefs`는 여러 개의 React ref를 하나로 합치는 유틸리티 함수예요. 하나의 엘리먼트에 여러 ref를 연결해야 할 때 유용하게 사용할 수 있어요.

## 인터페이스

```ts
function mergeRefs<T>(...refs: Array<RefObject<T> | RefCallback<T>>): RefCallback<T>;
```

### 파라미터

- `...refs` (`Array<RefObject<T> | RefCallback<T>>`): 합칠 ref들의 배열이에요. 각 ref는 `RefObject`나 `RefCallback` 타입이 될 수 있어요.

### 반환 값

모든 ref들을 업데이트하는 `RefCallback<T>`을 반환해요.

## 예시

```tsx
import { forwardRef, useRef } from 'react';
import { mergeRefs } from 'reactie';

const Component = forwardRef((props, parentRef) => {
  const localRef = useRef(null);

  return <div ref={mergeRefs(localRef, parentRef)}>내용</div>;
});
```
