# useToggle

`useToggle`은 불리언 상태를 간단하게 관리하도록 돕는 리액트 훅이에요. 상태를 `true`와 `false`로 번갈아 바꾸는 함수를 돌려줘요.

## 인터페이스

```ts
function useToggle(
  initialValue: boolean = false
): [state: boolean, toggle: () => void];
```

### 파라미터

<Interface
  name="initialValue"
  type="boolean"
  description="초기 상태 값이에요. 기본값은 <code>false</code>예요."
/>

### 반환 값

<Interface
  name=""
  type="[state: boolean, toggle: () => void]"
  description="다음 값을 담은 튜플이에요."
  :nested="[
    {
      name: 'state',
      type: 'boolean',
      description: '현재 상태 값이에요.',
    },
    {
      name: 'toggle',
      type: '() => void',
      description: '상태를 번갈아 바꾸는 함수예요.',
    },
  ]"
/>

## 예시

```tsx
import { useToggle } from 'react-simplikit';

function Component() {
  const [open, toggle] = useToggle(false);

  return (
    <div>
      <p>하단 시트 상태: {open ? '열림' : '닫힘'}</p>
      <button onClick={toggle}>토글</button>
    </div>
  );
}
```
