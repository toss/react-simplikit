# useBooleanState

`useBooleanState` は、真偽値の状態管理を簡単にする React フックです。
状態を `true` にする関数、`false` にする関数、値を切り替える関数を提供します。

## インターフェース

```ts
function useBooleanState(
  initialValue: boolean | (() => boolean) = false
): readonly [
  state: boolean,
  setTrue: () => void,
  setFalse: () => void,
  toggle: () => void,
];
```

### パラメータ

<Interface
  name="initialValue"
  type="boolean | (() => boolean)"
  description="状態の初期値です。デフォルトは <code>false</code> です。"
/>

### 戻り値

<Interface
  name=""
  type="readonly [state: boolean, setTrue: () => void, setFalse: () => void, toggle: () => void]"
  description="以下を含むタプル。"
  :nested="[
    {
      name: 'state',
      type: 'boolean',
      required: false,
      description: '現在の状態の値。',
    },
    {
      name: 'setTrue',
      type: '() => void',
      required: false,
      description: '状態を <code>true</code> にする関数。',
    },
    {
      name: 'setFalse',
      type: '() => void',
      required: false,
      description: '状態を <code>false</code> にする関数。',
    },
    {
      name: 'toggle',
      type: '() => void',
      required: false,
      description: '状態を切り替える関数。',
    },
  ]"
/>

## 使用例

```tsx
const [open, openBottomSheet, closeBottomSheet, toggleBottomSheet] =
  useBooleanState(false);
```
