# useBooleanState

`useBooleanState`는 `boolean` 상태를 쉽게 관리할 수 있도록 도와주는 React 훅이에요.  
`true`로 설정, `false`로 설정, 상태를 토글하는 기능을 제공해요.  
이 훅을 사용하면 불리언 상태를 더 간결하고 직관적으로 제어할 수 있어요.

## 인터페이스

```ts
function useBooleanState(defaultValue?: boolean): readonly [
  boolean, // 현재 상태 값
  () => void, // 상태를 true로 설정하는 함수
  () => void, // 상태를 false로 설정하는 함수
  () => void, // 상태를 토글하는 함수
];
```

### 파라미터

- `defaultValue` (`boolean`): 상태의 초기 값이에요. 기본값은 `false`예요.

### 반환 값

`readonly [boolean, () => void, () => void, () => void]` 형태의 튜플을 반환해요:

- `boolean`: 현재 상태 값이에요.
- `() => void`: 상태를 true로 설정하는 함수예요.
- `() => void`: 상태를 false로 설정하는 함수예요.
- `() => void`: 상태를 토글하는 함수예요.

## 예시

```tsx
import { useBooleanState } from 'reactive-kit';

function Component() {
  // useBooleanState 훅을 사용해 상태를 관리해요.
  const [open, openBottomSheet, closeBottomSheet, toggleBottomSheet] = useBooleanState(false);

  return (
    <div>
      <p>Bottom Sheet 상태: {open ? '열림' : '닫힘'}</p>
      <button onClick={openBottomSheet}>열기</button>
      <button onClick={closeBottomSheet}>닫기</button>
      <button onClick={toggleBottomSheet}>토글</button>
    </div>
  );
}
```
