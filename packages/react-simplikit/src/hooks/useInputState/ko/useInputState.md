# useInputState

`useInputState`는 입력 상태를 관리하는 리액트 훅이에요. 선택적으로 값 변환 함수를 지정할 수도 있어요. 반환되는 `onChange` 핸들러는 `<input>`과 `<textarea>` 두 요소 모두에서 사용할 수 있어요.

## 인터페이스

```ts
function useInputState(
  initialValue: string | (() => string) = '',
  transformValue: (nextValue: string, previousValue: string) => string = (
    nextValue: string
  ) => nextValue
): [
  value: string,
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
];
```

### 파라미터

<Interface
  name="initialValue"
  type="string | (() => string)"
  description='입력의 초기 값이에요. 기본값은 빈 문자열(<code>""</code>)이에요.'
/>

<Interface
  name="transformValue"
  type="(nextValue: string, previousValue: string) => string"
  description="입력 값을 변환하는 함수예요. 이전 상태 값이 두 번째 인자로 전달돼요. 기본값은 다음 입력 값을 그대로 반환하는 함수예요."
/>

### 반환 값

<Interface
  name=""
  type="[value: string, onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>]"
  description="다음 항목을 포함한 튜플이에요:"
  :nested="[
    {
      name: 'value',
      type: 'string',
      required: false,
      description: '현재 상태 값이에요.',
    },
    {
      name: 'onChange',
      type: 'ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>',
      required: false,
      description: '상태를 업데이트하는 함수예요.',
    },
  ]"
/>

## 예시

```tsx
function Example() {
  const [value, onChange] = useInputState('');
  return (
    <>
      <input type="text" value={value} onChange={onChange} />
      <textarea value={value} onChange={onChange} />
    </>
  );
}
```
