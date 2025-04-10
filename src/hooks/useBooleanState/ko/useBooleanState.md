# useBooleanState

`useBooleanState`는 불리언 상태를 관리하는 리액트 훅이에요. 상태를 `true`로 설정하거나, `false`로 설정하거나, 값을 반전시키는 기능을 제공해요.

## Interface
```ts
function useBooleanState(
  defaultValue: boolean = false,
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
  description="상태의 초기값이에요. 기본값은 <code>false</code>예요."
/>

### 반환 값

<Interface
  name=""
  type="readonly [state: boolean, setTrue: () => void, setFalse: () => void, toggle: () => void]"
  description="다음을 포함하는 튜플이에요:"
  :nested="[
    {
      name: 'state',
      type: 'boolean',
      description: '현재 상태 값이에요.',
    },
    {
      name: 'setTrue',
      type: '() => void',
      description: '상태를 <code>true</code>로 설정하는 함수예요.',
    },
    {
      name: 'setFalse',
      type: '() => void',
      description: '상태를 <code>false</code>로 설정하는 함수예요.',
    },
    {
      name: 'toggle',
      type: '() => void',
      description: '상태를 반전시키는 함수예요.',
    },
  ]"
/>


## 예시

```tsx
const [open, openBottomSheet, closeBottomSheet, toggleBottomSheet] = useBooleanState(false);
```
