# useInputState

`useInputState` は、入力値の状態を管理し、必要に応じて値を変換できる React フックです。
返される `onChange` ハンドラーは、`<input>` と `<textarea>` の両方の要素で使用できます。

## インターフェース

```ts
function useInputState(
  initialValue: string | (() => string) = '',
  transformValue: (value: string) => string = (v: string) => v
): [
  value: string,
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
];
```

### パラメータ

<Interface
  name="initialValue"
  type="string | (() => string)"
  description='入力値の初期値です。デフォルトは空文字列（<code>""</code>）です。'
/>

<Interface
  name="transformValue"
  type="(value: string) => string"
  description="入力値を変換する関数です。デフォルトは入力値をそのまま返す恒等関数です。"
/>

### 戻り値

<Interface
  name=""
  type="[value: string, onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>]"
  description="次の要素を含むタプルです。"
  :nested="[
    {
      name: 'value',
      type: 'string',
      required: false,
      description: '現在の状態の値です。',
    },
    {
      name: 'onChange',
      type: 'ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>',
      required: false,
      description: '状態を更新する関数です。',
    },
  ]"
/>

## 使用例

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
