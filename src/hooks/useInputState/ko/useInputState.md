# useInputState

`useInputState`는 선택적인 값 변환을 통해 입력 상태를 관리하는 리액트 훅이에요.

## Interface
```ts
function useInputState(
  initialValue: string = "",
  transformValue: (value: string) => string = (v: string) => v,
): readonly [value: string, onChange: (value: string) => void];

```

### 파라미터

<Interface
  name="initialValue"
  type="string"
  description='입력의 초기 값이에요. 기본값은 빈 문자열 (<code>""</code>)이에요.'
/>

<Interface
  name="transformValue"
  type="(value: string) => string"
  description="입력 값을 변환하는 함수예요. 기본값은 입력을 변하지 않은 채로 반환하는 동일 함수예요."
/>

### 반환 값

<Interface
  name=""
  type="readonly [value: string, onChange: (value: string) => void]"
  description="다음을 포함하는 튜플이에요:"
  :nested="[
    {
      name: 'value',
      type: 'string',
      description: '현재 상태 값이에요.',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      description: '상태를 업데이트하는 함수예요.',
    },
  ]"
/>


## 예시

```tsx
import { useInputState } from 'react-simplikit';

function Example() {
  const [value, setValue] = useInputState('');
  return <input type="text" value={value} onChange={setValue} />;
}
```
  
