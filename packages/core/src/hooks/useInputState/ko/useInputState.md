# useInputState

`useInputState`는 입력 상태를 관리하는 리액트 훅이에요. 선택적으로 값 변환 함수를 지정할 수도 있어요.

## 인터페이스

```ts
function useInputState(
  initialValue: string = '',
  transformValue: (value: string) => string = (v: string) => v
): [value: string, onChange: ChangeEventHandler<HTMLInputElement>];
```

### 파라미터

<Interface
  name="initialValue"
  type="string"
  description='입력의 초기 값이에요. 기본값은 빈 문자열(<code>""</code>)이에요.'
/>

<Interface
  name="transformValue"
  type="(value: string) => string"
  description="입력 값을 변환하는 함수예요. 기본값은 아무 변화 없이 입력을 반환하는 함수예요."
/>

### 반환 값

<Interface
  name=""
  type="[value: string, onChange: ChangeEventHandler<HTMLInputElement>]"
  description="튜플을 포함해요:"
  :nested="[
    {
      name: 'value',
      type: 'string',
      description: '현재 상태 값이에요.',
    },
    {
      name: 'onChange',
      type: 'ChangeEventHandler<HTMLInputElement>',
      description: '상태를 업데이트하는 함수예요.',
    },
  ]"
/>

## 예시

```tsx
function Example() {
  const [value, onChange] = useInputState('');
  return <input type="text" value={value} onChange={onChange} />;
}
```
