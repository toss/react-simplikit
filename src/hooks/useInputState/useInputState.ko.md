# useInputState

`useInputState`는 input 상태를 관리하는 React 훅이에요

## Interface

```ts
function useInputState(initialValue: string, transformValue: (value: string) => string = echo): void;
```

### Parameters

- `initialValue` (`string`): input 초기 값이에요. 기본값은 빈 문자열이에요.
- `transformValue` (`(value: string) => string`): 값 변환 함수이에요. 기본적으로 입력 값을 그대로 반환해요.

### Returns

 `readonly [string, (value: string) => void]` 형태의 튜플을 반환해요:

1. string: 현재 상태 값이에요.
2. (value: string) => void: 상태를 설정하는 함수예요.

## Examples

### Basic

```tsx
import { useInputState } from 'reactive-kit';

function Example() {
  const [value, setValue] = useInputState('');

  return (
      <input type="text" value={value} onChange={setValue} />
  );
}
```

### Make uppercase value

```tsx
import { useInputState } from 'reactive-kit';

function Example() {
  const [value, setValue] = useInputState('', v => v.toUpperCase());

  return <input type="text" value={value} onChange={setValue} />;
}
```
