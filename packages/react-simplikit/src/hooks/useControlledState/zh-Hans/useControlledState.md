# useControlledState

`useControlledState` 是一个允许你同时控制受控状态和不受控状态的 React Hook。如果你将状态传给 `value`，它就是受控状态；如果你将状态传给 `defaultValue`，它就是不受控状态。如果同时传入了 `value` 和 `defaultValue`，则 `value` 优先。

## 接口

```ts
function useControlledState<T>(props: Object): [T, Dispatch<SetStateAction<T>>];
```

### 参数

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
      description: '状态的值。',
    },
    {
      name: 'props.defaultValue',
      type: 'T',
      required: false,
      description: '状态的默认值。',
    },
    {
      name: 'props.onChange',
      type: '(value: T) => void',
      required: false,
      description:
        '状态变化时被调用的回调函数。',
    },
    {
      name: 'props.equalityFn',
      type: '(prev: T, next: T) => boolean',
      required: false,
      description:
        '用于比较前一个值和下一个值的函数。',
    },
  ]"
/>

### 返回值

<Interface
  name=""
  type="[T, Dispatch<SetStateAction<T>>]"
  description="状态和 setter 函数。"
/>

## 示例

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