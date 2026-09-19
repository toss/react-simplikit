# useInputState

`useInputState` 是一个管理输入状态并支持可选值转换的 React Hook。返回的 `onChange` 处理函数同时适用于 `<input>` 和 `<textarea>` 元素。

## 接口

```ts
function useInputState(
  initialValue: string | (() => string) = '',
  transformValue: (value: string) => string = (v: string) => v
): [
  value: string,
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
];
```

### 参数

<Interface
  name="initialValue"
  type="string | (() => string)"
  description='输入的初始值。默认值为空字符串（<code>""</code>）。'
/>

<Interface
  name="transformValue"
  type="(value: string) => string"
  description="用于转换输入值的函数。默认值为原样返回输入的恒等函数。"
/>

### 返回值

<Interface
  name=""
  type="[value: string, onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>]"
  description="包含以下内容的元组："
  :nested="[
    {
      name: 'value',
      type: 'string',
      required: false,
      description: '当前的状态值。',
    },
    {
      name: 'onChange',
      type: 'ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>',
      required: false,
      description: '更新状态的函数。',
    },
  ]"
/>

## 示例

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