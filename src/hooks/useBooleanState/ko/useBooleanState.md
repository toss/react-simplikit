# useBooleanState

`useBooleanState`는 불리언 상태 관리를 단순화하는 리액트 훅이에요. 상태를 `true`로 설정하고, `false`로 설정하고, 그 값을 토글할 수 있는 함수를 제공해요.

## Interface
```ts
function useBooleanState(
  defaultValue: boolean = false,
): [
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
  type="[state: boolean, setTrue: () => void, setFalse: () => void, toggle: () => void]"
  description="튜플로 구성되어 있어요:"
  :nested="[
    {
      name: 'state',
      type: 'boolean',
      description: '현재 상태 값이에요.',
    },
    {
      name: 'setTrue',
      type: '() => void',
      description: '상태를 <code>true</code>로 설정하는 함수에요.',
    },
    {
      name: 'setFalse',
      type: '() => void',
      description: '상태를 <code>false</code>로 설정하는 함수에요.',
    },
    {
      name: 'toggle',
      type: '() => void',
      description: '상태를 토글하는 함수에요.',
    },
  ]"
/>


## 예시

```tsx
const [open, openBottomSheet, closeBottomSheet, toggleBottomSheet] = useBooleanState(false);
```
  
