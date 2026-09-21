# buildContext

`buildContext` は、React のコンテキストを定義する際の繰り返しのコードを減らすヘルパー関数です。

## インターフェース

```ts
function buildContext<ContextValuesType extends object>(
  contextName: string,
  defaultContextValues?: ContextValuesType
): [
  Provider: (props: ProviderProps<ContextValuesType>) => JSX.Element,
  useContext: () => ContextValuesType,
];
```

### パラメータ

<Interface
  required
  name="contextName"
  type="string"
  description="コンテキストの名前。"
/>

<Interface
  name="defaultContextValues"
  type="ContextValuesType"
  description="コンテキストに渡すデフォルト値。"
/>

### 戻り値

<Interface
  name=""
  type="[Provider: (props: ProviderProps<ContextValuesType>) => JSX.Element, useContext: () => ContextValuesType]"
  description="次の要素を持つタプル。"
  :nested="[
    {
      name: 'Provider',
      type: '(props: ProviderProps<ContextValuesType>) => JSX.Element',
      required: false,
      description: 'コンテキストを提供するコンポーネント。',
    },
    {
      name: 'useContext',
      type: '() => ContextValuesType',
      required: false,
      description: 'コンテキストを使用するフック。',
    },
  ]"
/>

## 使用例

```tsx
const [Provider, useContext] = buildContext<{ title: string }>('TestContext', {
  title: 'Default title',
});

function Inner() {
  const { title } = useContext();
  return <div>{title}</div>;
}

function Page() {
  return (
    <Provider title="Hello">
      <Inner />
    </Provider>
  );
}
```
