# useControlledState

`useControlledState` は、制御された状態と非制御の状態の両方を扱える React フックです。
状態を `value` に渡すと制御された状態になり、`defaultValue` に渡すと非制御の状態になります。
`value` と `defaultValue` の両方を渡した場合は、`value` が優先されます。

## インターフェース

```ts
function useControlledState<T>(props: Object): [T, Dispatch<SetStateAction<T>>];
```

### パラメータ

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
      description: '状態の値。',
    },
    {
      name: 'props.defaultValue',
      type: 'T',
      required: false,
      description: '状態のデフォルト値。',
    },
    {
      name: 'props.onChange',
      type: '(value: T) => void',
      required: false,
      description:
        '状態が変わったときに呼び出されるコールバック関数。',
    },
    {
      name: 'props.equalityFn',
      type: '(prev: T, next: T) => boolean',
      required: false,
      description:
        '前回の値と次の値を比較する関数。',
    },
  ]"
/>

### 戻り値

<Interface
  name=""
  type="[T, Dispatch<SetStateAction<T>>]"
  description="状態と、その値を設定する関数。"
/>

## 使用例

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
