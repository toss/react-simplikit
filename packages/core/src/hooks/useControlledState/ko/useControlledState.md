# useControlledState

`useControlledState`는 제어된 상태와 비제어된 상태를 모두 제어할 수 있게 해주는 훅이에요. 상태를 `value`에 전달하면 제어된 상태가 되고, 상태를 `defaultValue`에 전달하면 비제어된 상태가 돼요. `value`와 `defaultValue`가 모두 전달되면, `value`가 우선권을 가져요.

## 인터페이스

```ts
function useControlledState(props: Object): [T, Dispatch<SetStateAction<T>>];
```

### 파라미터

<Interface
  required
  name="props"
  type="Object"
  description=""
  :nested="[
    {
      name: 'props.value',
      type: 'T',
      required: false,
      description: '상태의 값이에요.',
    },
    {
      name: 'props.defaultValue',
      type: 'T',
      required: false,
      description: '상태의 기본 값이에요.',
    },
    {
      name: 'props.onChange',
      type: '(value: T) => void',
      required: false,
      description:
        '상태가 변경될 때 호출되는 콜백 함수예요.',
    },
    {
      name: 'props.equalityFn',
      type: '(prev: T, next: T) => boolean',
      required: false,
      description:
        '이전 값과 다음 값을 비교하는 데 사용되는 함수예요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="[T, Dispatch<SetStateAction<T>>]"
  description="상태와 설정 함수예요."
/>

## 예시

```tsx
type ToggleProps = {
  value?: boolean;
  defaultValue?: boolean;
  onChange?: (value: boolean) => void;
};

function Toggle({ value, defaultValue, onChange }: ToggleProps) {
  const [on, setOn] = useControlledState({
    value,
    defaultValue: defaultValue ?? false,
    onChange,
  });

  return (
    <button onClick={() => setOn(prev => !prev)}>{on ? 'ON' : 'OFF'}</button>
  );
}
```
