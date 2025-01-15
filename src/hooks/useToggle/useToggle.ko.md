# useToggle

`useToggle`은 `boolean` 상태를 쉽게 관리할 수 있도록 도와주는 React 훅이에요. 상태를 토글하는 기능을 제공해요.

## 인터페이스

```ts
function useToggle(defaultValue?: boolean): readonly [
  boolean, // 현재 상태 값
  () => void, // 상태를 토글하는 함수
];
```

### 파라미터

- `defaultValue` (`boolean`): 상태의 초기 값이에요. 기본값은 `false`예요.

### 반환 값

`readonly [boolean, () => void]` 형태의 튜플을 반환해요:

1. boolean: 현재 상태 값이에요.
2. () => void: 상태를 토글하는 함수예요.

## 예시

```tsx
import { useToggle } from 'reactive-kit';

function Component() {
  // useToggle 훅을 사용해 상태를 관리해요.
  const [open, toggle] = useToggle(false);

  return (
    <div>
      <p>Bottom Sheet 상태: {open ? '열림' : '닫힘'}</p>
      <button onClick={toggle}>토글</button>
    </div>
  );
}
```
