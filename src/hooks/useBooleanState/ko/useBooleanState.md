# useBooleanState

`useBooleanState`는 불(boolean) 상태 관리를 간소화하는 리액트 훅이에요. 상태를 `true`로 설정하고, `false`로 설정하고, 값을 토글하는 함수를 제공해요.

## 인터페이스

```ts
function useBooleanState(
  defaultValue: boolean = false
): readonly [
  state: boolean,
  setTrue: () => void,
  setFalse: () => void,
  toggle: () => void,
];
```

### 파라미터

<Interface
  name="defaultValue"
  type="boolean"
  description="상태의 초기 값이에요. 기본값은 <code>false</code>예요."
/>

### 반환 값

<Interface
  name=""
  type="readonly [state: boolean, setTrue: () => void, setFalse: () => void, toggle: () => void]"
  description="튜플을 포함해요:"
  :nested="[
    {
      name: 'state',
      type: 'boolean',
      required: false,
      description: '현재 상태 값이에요.',
    },
    {
      name: 'setTrue',
      type: '() => void',
      required: false,
      description: '상태를 <code>true</code>로 설정하는 함수예요.',
    },
    {
      name: 'setFalse',
      type: '() => void',
      required: false,
      description: '상태를 <code>false</code>로 설정하는 함수예요.',
    },
    {
      name: 'toggle',
      type: '() => void',
      required: false,
      description: '상태를 토글하는 함수예요.',
    },
  ]"
/>

## 예시

```tsx
const [open, openBottomSheet, closeBottomSheet, toggleBottomSheet] = useBooleanState(false);
```

